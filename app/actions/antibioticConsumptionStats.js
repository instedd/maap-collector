import db from '../db';
import { remoteSync } from './sync';

const FETCH_ANTIBIOTIC_CONSUMPTION_STATS = 'FETCH_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCHED_ANTIBIOTIC_CONSUMPTION_STATS =
  'FETCHED_ANTIBIOTIC_CONSUMPTION_STATS';
const SYNC_ANTIBIOTIC_CONSUMPTION_STATS = 'SYNC_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED';

// TODO: Abstract this to a helper function
const mapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: SYNC_ANTIBIOTIC_CONSUMPTION_STATS });
  dispatch(
    remoteSync(
      '/api/v1/antibiotic_consumption_stats',
      user,
      'AntibioticConsumptionStat',
      mapper
    )
  );
};

export const fetchAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const { AntibioticConsumptionStat } = await db.initializeForUser(user);
  dispatch({ type: FETCH_ANTIBIOTIC_CONSUMPTION_STATS });
  const totalCount = await AntibioticConsumptionStat.count();
  AntibioticConsumptionStat.findAll({ limit: 15 })
    .then(items =>
      dispatch({
        type: FETCHED_ANTIBIOTIC_CONSUMPTION_STATS,
        items,
        totalCount
      })
    )
    .catch(error =>
      dispatch({ type: FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED, error })
    );
};

export {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCHED_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED
};
