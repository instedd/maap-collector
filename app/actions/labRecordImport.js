import fs from 'fs';
import { join, basename } from 'path';
import { remote } from 'electron';
import db from '../db';
import { syncStart } from './sync';

const SET_FILE_DATA = 'SET_FILE_DATA';
const SET_PHI_DATA = 'SET_PHI_DATA';
const SET_PATIENT_ID_DATA = 'SET_PATIENT_ID';
const CREATING_LAB_RECORD = 'CREATING_LAB_RECORD';

export const setFileData = data => ({ type: SET_FILE_DATA, data });
export const setPhiData = data => ({ type: SET_PHI_DATA, data });
export const setPatientIdData = data => ({ type: SET_PATIENT_ID_DATA, data });
export const createLabRecord = () => async (dispatch, getState) => {
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
      dispatch(syncStart());
      resolve(labRecord);
    });
  });
};

export { SET_FILE_DATA, SET_PHI_DATA, SET_PATIENT_ID_DATA };
