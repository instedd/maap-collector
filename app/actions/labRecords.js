import fs from 'fs';
import snakeCaseKeys from 'snakecase-keys';
import { isObject } from 'lodash';
import db from '../db';

import { fetchAuthenticated } from '../utils/fetch';
import { fetchEntity } from './fetch';

const FETCH_LAB_RECORDS = 'FETCH_LAB_RECORDS';
const FETCHED_LAB_RECORDS = 'FETCHED_LAB_RECORDS';
const FETCH_LAB_RECORDS_FAILED = 'FETCH_LAB_RECORDS_FAILED';
const FETCHED_LAB_RECORD = 'FETCHED_LAB_RECORD';
const FETCHING_LAB_RECORD = 'FETCHING_LAB_RECORD';

const uploadMapper = async (attr, record) =>
  snakeCaseKeys({
    ...attr,
    date: Object.values(attr.date),
    siteId: await record.getRemoteSiteId(),
    lab_records_attributes: attr.rows.map((row, index) => ({
      content: [...row],
      row: index
    }))
  });

export const syncLabRecords = () => async dispatch =>
  dispatch(uploadNewLabRecords()).then(() =>
    dispatch(uploadUpdatedLabRecords())
  );

export const uploadNewLabRecords = () => async (dispatch, getState) => {
  const { user } = getState();
  const { LabRecord, sequelize } = await db.initializeForUser(user);

  const collectionToCreate = await LabRecord.findAll({
    where: sequelize.literal('remoteId is NULL')
  });
  if (collectionToCreate.length === 0) return;

  collectionToCreate.forEach(async labRecord => {
    const body = new FormData();
    const contents = fs.readFileSync(labRecord.filePath);
    const blob = new Blob([contents]);
    const mapper = await uploadMapper(labRecord.dataValues, labRecord);
    // eslint-disable-next-line
    Object.keys(mapper).forEach(key => {
      if (isObject(mapper[key])) {
        body.append(key, JSON.stringify(mapper[key]));
      } else {
        body.append(key, mapper[key]);
      }
    });
    body.append('sheet_file', blob);
    fetchAuthenticated('/api/v1/lab_record_imports', user.auth, {
      method: 'POST',
      body,
      contentType: null
    })
      .then(res =>
        labRecord.update({ remoteId: res.id, lastSyncAt: new Date() })
      )
      .then(() => {
        fs.unlink(
          labRecord.filePath,
          e =>
            e
              ? console.log(e)
              : console.log(`${labRecord.filePath} file deleted successfully`)
        );
        return Promise.resolve();
      })
      .catch(e => console.log(e));
  });
  return Promise.resolve();
};

export const uploadUpdatedLabRecords = () => async (dispatch, getState) => {
  const { user } = getState();
  const { LabRecord, sequelize } = await db.initializeForUser(user);
  const collectionToUpdate = await LabRecord.findAll({
    where: sequelize.literal(
      "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M', updatedAt) > strftime('%Y-%m-%d %H:%M', lastSyncAt)"
    )
  });

  collectionToUpdate.forEach(async labRecord => {
    fetchAuthenticated(
      `/api/v1/lab_record_imports/${labRecord.remoteId}`,
      user.auth,
      {
        method: 'PUT',
        body: { rows: labRecord.rows }
      }
    )
      .then(() => {
        const updatedAt = new Date();
        return labRecord.update({ lastSyncAt: updatedAt, updatedAt });
      })
      .catch(e => console.log(e));
  });
  return Promise.resolve();
};

export const fetchLabRecords = fetchEntity('LabRecord');
export const fetchLabRecord = labRecordId => async (dispatch, getState) => {
  dispatch({ type: FETCHING_LAB_RECORD });
  const { user } = getState();
  const { LabRecord } = await db.initializeForUser(user);

  const labRecord = await LabRecord.findOne({ where: { id: labRecordId } });
  dispatch({ type: FETCHED_LAB_RECORD, labRecord });

  return labRecord;
};

export {
  FETCH_LAB_RECORDS,
  FETCHED_LAB_RECORDS,
  FETCH_LAB_RECORDS_FAILED,
  FETCHED_LAB_RECORD,
  FETCHING_LAB_RECORD
};
