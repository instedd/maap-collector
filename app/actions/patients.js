import snakeCaseKeys from 'snakecase-keys';
import camelCaseKeys from 'camelcase-keys';
import { omit } from 'lodash';
import { remoteUpload, remoteSync } from './sync';
import { fetchEntity } from './fetch';

const FETCH_PATIENTS = 'FETCH_PATIENTS';
const FETCHED_PATIENTS = 'FETCHED_PATIENTS';
const FETCH_PATIENTS_FAILED = 'FETCH_PATIENTS_FAILED';
const SYNC_PATIENTS = 'SYNC_PATIENTS';
const UPLOAD_PATIENTS = 'UPLOAD_PATIENTS';

const mapper = attrs =>
  omit(
    camelCaseKeys({
      ...attrs,
      remoteId: attrs.id,
      remotePatientId: attrs.patient_id,
      remoteSiteId: attrs.site_id
    }),
    ['patientId', 'siteId']
  );
const uploadMapper = async attrs =>
  snakeCaseKeys({ ...attrs.dataValues, siteId: await attrs.getRemoteSiteId() });

export const fetchPatients = fetchEntity('Patient');
export const syncPatients = () => async (dispatch, getState) => {
  const { user, site } = getState();
  dispatch({ type: SYNC_PATIENTS });
  return dispatch(remoteSync('/api/v1/patients', user, 'Patient', mapper))
    .then(() => dispatch(uploadPatients()))
    .then(() => site && dispatch(fetchPatients({ siteId: site.id })));
};

export const uploadPatients = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_PATIENTS });
  dispatch(remoteUpload('/api/v1/patients', user, 'Patient', uploadMapper));
};

export { FETCH_PATIENTS, FETCHED_PATIENTS, FETCH_PATIENTS_FAILED };
