import { omit } from 'lodash';
import snakeCaseKeys from 'snakecase-keys';
import camelCaseKeys from 'camelcase-keys';
import moment from 'moment';

import { fetchEntity } from './fetch';
import { remoteSync, remoteUpload, remoteUploadUpdate } from './sync';

const FETCH_PATIENT_ENTRIES = 'FETCH_PATIENT_ENTRIES';
const FETCHED_PATIENT_ENTRIES = 'FETCHED_PATIENT_ENTRIES';
const FETCH_PATIENT_ENTRIES_FAILED = 'FETCH_PATIENT_ENTRIES_FAILED';
const SYNC_PATIENT_ENTRIES = 'SYNC_PATIENT_ENTRIES';
const UPLOAD_PATIENT_ENTRIES_STATS = 'UPLOAD_PATIENT_ENTRIES_STATS';

const mapper = attrs =>
  omit(
    camelCaseKeys({
      ...attrs,
      remoteId: attrs.id,
      remotePatientId: attrs.patient_id,
      remotePatientLocationId: attrs.patient_location_id,
      patientId: null,
      siteId: null
    }),
    ['id', 'admissionDate', 'dischargeDate', 'updatedAt', 'createdAt']
  );
const uploadMapper = async attrs => {
  const admissionDate = moment(attrs.admissionDate);
  const dischargeDate = moment(attrs.dischargeDate);
  const stayTimespan =
    attrs.admissionDate && attrs.dischargeDate
      ? moment.duration(dischargeDate.diff(admissionDate)).asSeconds()
      : null;
  return snakeCaseKeys({
    ...attrs.dataValues,
    patientId: await attrs.getRemotePatientId(),
    patientLocationId: await attrs.getRemotePatientLocationId(),
    stayTimespan
  });
};

export const fetchPatientEntries = fetchEntity('PatientEntry');
export const syncPatientEntries = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SYNC_PATIENT_ENTRIES });
  return dispatch(
    remoteSync('/api/v1/patient_entries', user, 'PatientEntry', mapper)
  ).then(() => dispatch(uploadPatientEntries()));
};

export const uploadPatientEntries = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_PATIENT_ENTRIES_STATS });
  await dispatch(
    remoteUpload('/api/v1/patient_entries', user, 'PatientEntry', uploadMapper)
  );

  await dispatch(
    remoteUploadUpdate(
      id => `/api/v1/patient_entries/${id}`,
      'PatientEntry',
      uploadMapper
    )
  );
};

export {
  FETCH_PATIENT_ENTRIES,
  FETCHED_PATIENT_ENTRIES,
  FETCH_PATIENT_ENTRIES_FAILED
};
