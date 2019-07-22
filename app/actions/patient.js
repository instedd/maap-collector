import db from '../db';

import { fetchPatients } from './patients';

const SAVING_PATIENT = 'SAVING_PATIENT';
const SAVED_PATIENT = 'SAVED_PATIENT';

export const createPatient = attributes => async (dispatch, getState) => {
  const { user } = getState();
  const { Patient } = await db.initializeForUser(user);
  dispatch({ type: SAVING_PATIENT });

  const record = await Patient.create(attributes);

  dispatch({ type: SAVED_PATIENT, record });
  return dispatch(fetchPatients());
};

export { SAVING_PATIENT, SAVED_PATIENT };
