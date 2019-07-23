import db from '../db';

import { fetchPatientEntries } from './patientEntries';

const SAVING_PATIENT_ENTRY = 'SAVING_PATIENT_ENTRY';
const SAVED_PATIENT_ENTRY = 'SAVED_PATIENT_ENTRY';

export const createPatientEntry = attributes => async (dispatch, getState) => {
  const { user } = getState();
  const { PatientEntry } = await db.initializeForUser(user);
  dispatch({ type: SAVING_PATIENT_ENTRY });

  const record = await PatientEntry.create(attributes);

  dispatch({ type: SAVED_PATIENT_ENTRY, record });
  return dispatch(fetchPatientEntries());
};

export { SAVING_PATIENT_ENTRY, SAVED_PATIENT_ENTRY };
