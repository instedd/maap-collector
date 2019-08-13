import db from '../db';

import { syncStart } from './sync';
import { fetchPatients } from './patients';

const SAVING_PATIENT = 'SAVING_PATIENT';
const SAVING_PATIENT_FAILED = 'SAVING_PATIENT_FAILED';
const SAVED_PATIENT = 'SAVED_PATIENT';

export const createPatient = attributes => async (dispatch, getState) => {
  const { user, site } = getState();
  const { Patient } = await db.initializeForUser(user);
  dispatch({ type: SAVING_PATIENT });

  return Patient.create({ ...attributes, siteId: site.id })
    .then(record => {
      dispatch({ type: SAVED_PATIENT, record });
      dispatch(syncStart());
      return dispatch(fetchPatients({ siteId: site.id }));
    })
    .catch(e => {
      dispatch({
        type: SAVING_PATIENT_FAILED,
        errors: [...new Set(e.errors.map(({ message }) => message))]
      });
      throw e;
    });
};

export { SAVING_PATIENT, SAVED_PATIENT, SAVING_PATIENT_FAILED };
