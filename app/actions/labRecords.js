import db from '../db';

const FETCH_LAB_RECORDS = 'FETCH_LAB_RECORDS';
const FETCHED_LAB_RECORDS = 'FETCHED_LAB_RECORDS';
const FETCH_LAB_RECORDS_FAILED = 'FETCH_LAB_RECORDS_FAILED';

export const fetchLabRecords = () => async (dispatch, getState) => {
  const { user } = getState();
  const { LabRecord } = await db.initializeForUser(user);
  dispatch({ type: FETCH_LAB_RECORDS });
  const totalCount = await LabRecord.count();
  LabRecord.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_LAB_RECORDS, items, totalCount }))
    .catch(error => dispatch({ type: FETCH_LAB_RECORDS_FAILED, error }));
};

export { FETCH_LAB_RECORDS, FETCHED_LAB_RECORDS, FETCH_LAB_RECORDS_FAILED };
