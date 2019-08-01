import snakeCaseKeys from 'snakecase-keys';
import { remoteSync, remoteUpload } from './sync';
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
const mapper = props => ({
  ...props,
  remoteId: props.id,
  remoteAntibioticId: props.antibiotic_id,
  recipientFacility: props.recipient_facility,
  recipientUnit: props.recipient_unit,
  antibioticId: null
});

const uploadMapper = props => ({
  ...snakeCaseKeys(props.dataValues),
  id: props.dataValues.remoteId
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
  dispatch(
    remoteUpload(
      '/api/v1/antibiotic_consumption_stats',
      user,
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
