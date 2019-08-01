import { fetchEntity } from './fetch';

const FETCH_LAB_RECORDS = 'FETCH_LAB_RECORDS';
const FETCHED_LAB_RECORDS = 'FETCHED_LAB_RECORDS';
const FETCH_LAB_RECORDS_FAILED = 'FETCH_LAB_RECORDS_FAILED';

export const fetchLabRecords = fetchEntity('LabRecord');

export { FETCH_LAB_RECORDS, FETCHED_LAB_RECORDS, FETCH_LAB_RECORDS_FAILED };
