import snakeCaseKeys from 'snakecase-keys';
import camelCaseKeys from 'camelcase-keys';
import { remoteUpload, remoteSync } from './sync';
import { fetchEntity } from './fetch';

const FETCH_PATIENTS = 'FETCH_PATIENTS';
const FETCHED_PATIENTS = 'FETCHED_PATIENTS';
const FETCH_PATIENTS_FAILED = 'FETCH_PATIENTS_FAILED';
const SYNC_PATIENTS = 'SYNC_PATIENTS';
const UPLOAD_PATIENTS = 'UPLOAD_PATIENTS';

const mapper = attrs =>
  camelCaseKeys({
    ...attrs,
    remoteId: attrs.id
  });
const uploadMapper = attrs => snakeCaseKeys({ ...attrs.dataValues });

export const fetchPatients = fetchEntity('Patient');
export const syncPatients = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SYNC_PATIENTS });
  return dispatch(remoteSync('/api/v1/patients', user, 'Patient', mapper))
    .then(() => dispatch(uploadPatients()))
    .then(() => dispatch(fetchPatients()));
};

export const uploadPatients = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_PATIENTS });
  dispatch(remoteUpload('/api/v1/patients', user, 'Patient', uploadMapper));
};

export { FETCH_PATIENTS, FETCHED_PATIENTS, FETCH_PATIENTS_FAILED };
