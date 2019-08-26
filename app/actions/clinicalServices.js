import { omit } from 'lodash';
import { remoteSync } from './sync';
import { fetchEntity } from './fetch';

const FETCH_CLINICAL_SERVICES = 'FETCH_CLINICAL_SERVICES';
const FETCHED_CLINICAL_SERVICES = 'FETCHED_CLINICAL_SERVICES';
const CLINICAL_SERVICES_FETCH_FAILED = 'CLINICAL_SERVICES_FETCH_FAILED';
const SYNC_CLINICAL_SERVICES = 'SYNC_CLINICAL_SERVICES';

// TODO: Abstract this to a helper function
const clinicalServicesMapper = props =>
  omit(
    {
      ...props,
      remoteId: props.id
    },
    ['id', 'createdAt', 'updatedAt']
  );

export const syncClinicalServices = () => async (dispatch, getState) => {
  const { user } = getState();

  dispatch({ type: SYNC_CLINICAL_SERVICES });
  return dispatch(
    remoteSync(
      '/api/v1/clinical_services',
      user,
      'ClinicalService',
      clinicalServicesMapper
    )
  ).then(() => dispatch(fetchClinicalServices()));
};

export const fetchClinicalServices = fetchEntity('ClinicalService');

export {
  FETCH_CLINICAL_SERVICES,
  FETCHED_CLINICAL_SERVICES,
  CLINICAL_SERVICES_FETCH_FAILED,
  SYNC_CLINICAL_SERVICES
};
