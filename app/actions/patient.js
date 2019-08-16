// @flow

import db from '../db';

import { syncStart } from './sync';
import { fetchPatients } from './patients';

const SAVING_PATIENT = 'SAVING_PATIENT';
const SAVING_PATIENT_FAILED = 'SAVING_PATIENT_FAILED';
const SAVED_PATIENT = 'SAVED_PATIENT';
const FETCHING_PATIENT = 'FETCHING_PATIENT';
const FETCHED_PATIENT = 'FETCHED_PATIENT';

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

export const fetchPatient = (patientId: string) => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  dispatch({ type: FETCHING_PATIENT });
  const { user } = getState();
  const { Patient } = await db.initializeForUser(user);

  const patient = await Patient.findOne({
    where: { id: patientId }
  });
  dispatch({ type: FETCHED_PATIENT, patient });
};

export {
  SAVING_PATIENT,
  SAVED_PATIENT,
  SAVING_PATIENT_FAILED,
  FETCHING_PATIENT,
  FETCHED_PATIENT
};
