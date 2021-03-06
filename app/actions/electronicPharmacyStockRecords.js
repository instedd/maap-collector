import fs from 'fs';
import snakeCaseKeys from 'snakecase-keys';
import { isObject } from 'lodash';
import { fetchAuthenticated } from '../utils/fetch';
import { fetchEntity, fetchEntitySingular } from './fetch';
import createJSONFile from '../utils/attachments';
import db from '../db';

const FETCH_ELECTRONIC_PHARMACY_STOCK_RECORDS =
  'FETCH_ELECTRONIC_PHARMACY_STOCK_RECORDS';
const FETCH_ELECTRONIC_PHARMACY_STOCK_RECORD =
  'FETCH_ELECTRONIC_PHARMACY_STOCK_RECORD';
const FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORDS =
  'FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORDS';
const FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORD =
  'FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORD';
const UPLOAD_ELECTRONIC_PHARMACY_STOCK_RECORDS =
  'UPLOAD_ELECTRONIC_PHARMACY_STOCK_RECORDS';

const uploadMapper = async (attr, record) => {
  const { rows, ...withoutRows } = attr;
  return snakeCaseKeys({
    ...withoutRows,
    date: Object.values(attr.date),
    siteId: await record.getRemoteSiteId()
  });
};

export const fetchElectronicPharmacyStockRecords = (where, attributes) =>
  fetchEntity('ElectronicPharmacyStockRecord')({ where, attributes });
export const fetchElectronicPharmacyStockRecord = fetchEntitySingular(
  'ElectronicPharmacyStockRecord'
);

export const syncElectronicPharmacyStockRecords = () => async dispatch => {
  dispatch({ type: UPLOAD_ELECTRONIC_PHARMACY_STOCK_RECORDS });
  return dispatch(uploadNewElectronicPharmacyStockRecords());
};

export const uploadNewElectronicPharmacyStockRecords = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const {
    ElectronicPharmacyStockRecord,
    sequelize
  } = await db.initializeForUser(user);

  const collectionToCreate = await ElectronicPharmacyStockRecord.findAll({
    where: sequelize.literal('remoteId is NULL')
  });
  if (collectionToCreate.length === 0) return;

  return Promise.all(
    collectionToCreate.map(async electronicPharmacyStockRecord => {
      const body = new FormData();
      const contents = fs.readFileSync(electronicPharmacyStockRecord.filePath);
      const blob = new Blob([contents]);
      const electronicPharmacyValues = electronicPharmacyStockRecord.dataValues;
      const mapper = await uploadMapper(
        electronicPharmacyValues,
        electronicPharmacyStockRecord
      );
      const rowsFile = createJSONFile(
        electronicPharmacyValues.rows,
        'rows.json'
      );

      // eslint-disable-next-line
      Object.keys(mapper).forEach(key => {
        if (isObject(mapper[key])) {
          body.append(key, JSON.stringify(mapper[key]));
        } else {
          body.append(key, mapper[key]);
        }
      });
      body.append('sheet_file', blob);
      body.append('rows_file', rowsFile);
      return fetchAuthenticated(
        '/api/v1/electronic_pharmacy_stock_records',
        user.auth,
        {
          method: 'POST',
          body,
          contentType: null
        }
      )
        .then(res =>
          electronicPharmacyStockRecord.update({
            remoteId: res.id,
            lastSyncAt: new Date()
          })
        )
        .then(() => {
          fs.unlink(
            electronicPharmacyStockRecord.filePath,
            e =>
              e
                ? console.log(e)
                : console.log(
                    `${
                      electronicPharmacyStockRecord.filePath
                    } file deleted successfully`
                  )
          );
          return Promise.resolve();
        })
        .catch(e => console.log(e));
    })
  );
};

export {
  FETCH_ELECTRONIC_PHARMACY_STOCK_RECORDS,
  FETCH_ELECTRONIC_PHARMACY_STOCK_RECORD,
  FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORDS,
  FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORD
};
