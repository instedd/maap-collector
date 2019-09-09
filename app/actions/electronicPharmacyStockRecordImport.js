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
  const { labRecordImport: labRecordImportState, user, site } = getState();
  const { LabRecord } = await db.initializeForUser(user);
  const { file } = labRecordImportState;
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

      const labRecord = await LabRecord.create({
        filePath: newFilePath,
        fileName,
        siteId: site.id,
        ...labRecordImportState
      });

      dispatch({ type: 'CREATED_LAB_RECORD', id: labRecord.id });
      resolve(labRecord);
    });
  });
};
export const cleanWizard = () => ({ type: CLEAN_LAB_RECORD_IMPORT });

export { SET_IMPORT_DATA, CLEAN_LAB_RECORD_IMPORT };
