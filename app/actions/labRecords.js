import fs from 'fs';
import snakeCaseKeys from 'snakecase-keys';
import { isObject } from 'lodash';
import db from '../db';

import { fetchAuthenticated } from '../utils/fetch';
import createJSONFile from '../utils/attachments';
import { fetchEntity } from './fetch';

const FETCH_LAB_RECORDS = 'FETCH_LAB_RECORDS';
const FETCHED_LAB_RECORDS = 'FETCHED_LAB_RECORDS';
const UPLOAD_LAB_RECORDS = 'UPLOAD_LAB_RECORDS';
const FETCH_LAB_RECORDS_FAILED = 'FETCH_LAB_RECORDS_FAILED';
const FETCHED_LAB_RECORD = 'FETCHED_LAB_RECORD';
const FETCHING_LAB_RECORD = 'FETCHING_LAB_RECORD';

const uploadMapper = async (attr, record) => {
  const { rows, ...withoutRows } = attr;
  return snakeCaseKeys({
    ...withoutRows,
    date: Object.values(attr.date),
    siteId: await record.getRemoteSiteId()
  });
};

export const syncLabRecords = () => async dispatch => {
  dispatch({ type: UPLOAD_LAB_RECORDS });
  return dispatch(uploadNewLabRecords()).then(() =>
    dispatch(uploadUpdatedLabRecords())
  );
};

export const uploadNewLabRecords = () => async (dispatch, getState) => {
  const { user } = getState();
  const { LabRecord, sequelize } = await db.initializeForUser(user);

  const collectionToCreate = await LabRecord.findAll({
    where: sequelize.literal('remoteId is NULL')
  });
  if (collectionToCreate.length === 0) return;

  return Promise.all(
    collectionToCreate.map(async labRecord => {
      const body = new FormData();
      const contents = fs.readFileSync(labRecord.filePath);
      const blob = new Blob([contents]);
      const labRecordValues = labRecord.dataValues;
      const mapper = await uploadMapper(labRecordValues, labRecord);
      const rows = labRecordValues.rows.map((row, index) => ({
        content: [...row],
        row: index
      }));
      const rowsFile = createJSONFile(rows, 'rows.json');

      // eslint-disable-next-line
      Object.keys(mapper).map(key => {
        if (isObject(mapper[key])) {
          body.append(key, JSON.stringify(mapper[key]));
        } else {
          body.append(key, mapper[key]);
        }
      });
      body.append('sheet_file', blob);
      body.append('rows_file', rowsFile);
      return fetchAuthenticated('/api/v1/lab_record_imports', user.auth, {
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
    })
  );
};

export const uploadUpdatedLabRecords = () => async (dispatch, getState) => {
  const { user } = getState();
  const { LabRecord, sequelize } = await db.initializeForUser(user);
  const collectionToUpdate = await LabRecord.findAll({
    where: sequelize.literal(
      "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M', updatedAt) > strftime('%Y-%m-%d %H:%M', lastSyncAt)"
    )
  });

  return Promise.all(
    collectionToUpdate.map(async labRecord => {
      const body = new FormData();
      body.append('rows_file', createJSONFile(labRecord.rows, 'rows.json'));
      return fetchAuthenticated(
        `/api/v1/lab_record_imports/${labRecord.remoteId}`,
        user.auth,
        {
          method: 'PUT',
          body,
          contentType: null
        }
      )
        .then(() => {
          const updatedAt = new Date();
          return labRecord.update({ lastSyncAt: updatedAt, updatedAt });
        })
        .catch(e => console.log(e));
    })
  );
};

export const fetchLabRecords = (where, attributes) =>
  fetchEntity('LabRecord')({ where, attributes });

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
