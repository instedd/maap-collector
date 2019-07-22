import db from '../db';

const FETCH_PATIENTS = 'FETCH_PATIENTS';
const FETCHED_PATIENTS = 'FETCHED_PATIENTS';
const FETCH_PATIENTS_FAILED = 'FETCH_PATIENTS_FAILED';

export const fetchPatients = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Patient } = await db.initializeForUser(user);
  dispatch({ type: FETCH_PATIENTS });
  const totalCount = await Patient.count();
  Patient.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_PATIENTS, items, totalCount }))
    .catch(error => dispatch({ type: FETCH_PATIENTS_FAILED, error }));
};

export { FETCH_PATIENTS, FETCHED_PATIENTS, FETCH_PATIENTS_FAILED };
