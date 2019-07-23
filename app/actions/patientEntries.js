import db from '../db';

const FETCH_PATIENT_ENTRIES = 'FETCH_PATIENT_ENTRIES';
const FETCHED_PATIENT_ENTRIES = 'FETCHED_PATIENT_ENTRIES';
const FETCH_PATIENT_ENTRIES_FAILED = 'FETCH_PATIENT_ENTRIES_FAILED';

export const fetchPatientEntries = patientId => async (dispatch, getState) => {
  const { user } = getState();
  const { PatientEntry } = await db.initializeForUser(user);
  dispatch({ type: FETCH_PATIENT_ENTRIES });
  const totalCount = await PatientEntry.count();
  PatientEntry.findAll({ where: { patientId }, limit: 15 })
    .then(items =>
      dispatch({ type: FETCHED_PATIENT_ENTRIES, items, totalCount })
    )
    .catch(error => dispatch({ type: FETCH_PATIENT_ENTRIES_FAILED, error }));
};

export {
  FETCH_PATIENT_ENTRIES,
  FETCHED_PATIENT_ENTRIES,
  FETCH_PATIENT_ENTRIES_FAILED
};
