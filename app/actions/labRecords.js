import db from '../db';
import { fetchEntity } from './fetch';

const FETCH_LAB_RECORDS = 'FETCH_LAB_RECORDS';
const FETCHED_LAB_RECORDS = 'FETCHED_LAB_RECORDS';
const FETCH_LAB_RECORDS_FAILED = 'FETCH_LAB_RECORDS_FAILED';
const FETCHED_LAB_RECORD = 'FETCHED_LAB_RECORD';
const FETCHING_LAB_RECORD = 'FETCHING_LAB_RECORD';

export const fetchLabRecords = fetchEntity('LabRecord');
export const fetchLabRecord = labRecordId => async (dispatch, getState) => {
  dispatch({ type: FETCHING_LAB_RECORD });
  const { user } = getState();
  const { LabRecord } = await db.initializeForUser(user);

  const labRecord = await LabRecord.findOne({ id: labRecordId });
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
