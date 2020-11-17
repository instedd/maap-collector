import db from '../db';

import { fetchPatientEntries } from './patientEntries';
import { fetchEntitySingular } from './fetch';
import { updateEntity } from './persistence';

const SAVING_PATIENT_ENTRY = 'SAVING_PATIENT_ENTRY';
const SAVED_PATIENT_ENTRY = 'SAVED_PATIENT_ENTRY';
const FETCHED_PATIENT_ENTRY = 'FETCHED_PATIENT_ENTRY';
const CLEAN_PATIENT_ENTRY = 'CLEAN_PATIENT_ENTRY';
const PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS =
  'PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS';

export const openPatientEntry = () => async (dispatch, getState) => {
  dispatch({ type: 'OPEN_PATIENT_ENTRY' });

  const { user } = getState();
  const { sequelize } = await db.initializeForUser(user);

  const queryResult = await sequelize.query(
    'SELECT DISTINCT(name) as value, name as label FROM Antibiotics ORDER BY value'
  );

  dispatch({
    type: PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS,
    antibioticOptions: queryResult && queryResult[0]
  });
};

export const cleanPatientEntry = () => async dispatch =>
  dispatch({ type: CLEAN_PATIENT_ENTRY });

export const fetchPatientEntry = fetchEntitySingular('PatientEntry');
export const updatePatientEntry = updateEntity('PatientEntry');
export const createPatientEntry = attributes => async (dispatch, getState) => {
  const { user } = getState();
  const { PatientEntry } = await db.initializeForUser(user);
  dispatch({ type: SAVING_PATIENT_ENTRY });

  const record = await PatientEntry.create(attributes);

  dispatch({ type: SAVED_PATIENT_ENTRY, record });
  return dispatch(fetchPatientEntries({ patientId: attributes.patientId }));
};

export {
  SAVING_PATIENT_ENTRY,
  SAVED_PATIENT_ENTRY,
  FETCHED_PATIENT_ENTRY,
  CLEAN_PATIENT_ENTRY,
  PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS
};
