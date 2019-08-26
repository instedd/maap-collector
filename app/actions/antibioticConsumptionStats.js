import snakeCaseKeys from 'snakecase-keys';
import { omit } from 'lodash';
import { remoteSync, remoteUpload, remoteUploadUpdate } from './sync';
import { fetchEntity } from './fetch';

const UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS =
  'UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS = 'FETCH_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCHED_ANTIBIOTIC_CONSUMPTION_STATS =
  'FETCHED_ANTIBIOTIC_CONSUMPTION_STATS';
const SYNC_ANTIBIOTIC_CONSUMPTION_STATS = 'SYNC_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED';

// TODO: Abstract this to a helper function
const mapper = attrs =>
  omit(
    {
      ...attrs,
      remoteId: attrs.id,
      remoteAntibioticId: attrs.antibiotic_id,
      recipientFacility: attrs.recipient_facility,
      recipientUnit: attrs.recipient_unit,
      antibioticId: null,
      remoteSiteId: attrs.site_id,
      siteId: null
    },
    ['id']
  );

const uploadMapper = async props => ({
  ...snakeCaseKeys(props.dataValues),
  id: props.dataValues.remoteId,
  siteId: await props.getRemoteSiteId(),
  antibioticId: await props.getRemoteAntibioticId()
});

export const syncAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: SYNC_ANTIBIOTIC_CONSUMPTION_STATS });
  return dispatch(
    remoteSync(
      '/api/v1/antibiotic_consumption_stats',
      user,
      'AntibioticConsumptionStat',
      mapper
    )
  ).then(() => dispatch(uploadAntibioticConsumptionStats()));
};

export const uploadAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS });
  await dispatch(
    remoteUpload(
      '/api/v1/antibiotic_consumption_stats',
      user,
      'AntibioticConsumptionStat',
      uploadMapper
    )
  );
  await dispatch(
    remoteUploadUpdate(
      id => `/api/v1/antibiotic_consumption_stats/${id}`,
      'AntibioticConsumptionStat',
      uploadMapper
    )
  );
};

export const fetchAntibioticConsumptionStats = fetchEntity(
  'AntibioticConsumptionStat'
);

export {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCHED_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED
};
