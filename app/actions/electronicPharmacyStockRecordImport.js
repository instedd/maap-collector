import fs from 'fs';
import { join, basename } from 'path';
import { remote } from 'electron';
import db from '../db';

const SET_IMPORT_DATA = 'SET_IMPORT_DATA';
const CREATING_LAB_RECORD = 'CREATING_LAB_RECORD';
const CLEAN_LAB_RECORD_IMPORT = 'CLEAN_LAB_RECORD_IMPORT';

export const setImportData = data => ({ type: SET_IMPORT_DATA, data });
export const createElectronicPharmacyStockRecord = () => async (
  dispatch,
  getState
) => {
  const {
    electronicPharmacyStockRecordImport: ElectronicPharmacyStockRecordState,
    user,
    site
  } = getState();
  const { ElectronicPharmacyStockRecord } = await db.initializeForUser(user);
  const { file } = ElectronicPharmacyStockRecordState;
  const fileName = basename(file.path);
  const newFilePath = join(
    remote.app.getPath('userData'),
    '/maap/app/storage/',
    `${fileName}.${(+new Date()).toString(10)}`
  );
  dispatch({ type: CREATING_LAB_RECORD });
  return new Promise((resolve, reject) => {
    fs.copyFile(file.path, newFilePath, async err => {
      if (err) reject(err);

      const electronicPharmacyStockRecord = await ElectronicPharmacyStockRecord.create(
        {
          filePath: newFilePath,
          fileName,
          siteId: site.id,
          ...ElectronicPharmacyStockRecordState
        }
      );

      dispatch({
        type: 'CREATED_ELECTRONIC_PHARMACY_STOCK_RECORD',
        id: electronicPharmacyStockRecord.id
      });
      resolve(electronicPharmacyStockRecord);
    });
  });
};
export const cleanWizard = () => ({ type: CLEAN_LAB_RECORD_IMPORT });

export { SET_IMPORT_DATA, CLEAN_LAB_RECORD_IMPORT };
