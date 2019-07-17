import db from '../db';
import { remoteSync } from './sync';

const FETCH_ANTIBIOTICS = 'FETCH_ANTIBIOTICS';
const FETCHED_ANTIBIOTICS = 'FETCHED_ANTIBIOTICS';
const SYNC_ANTIBIOTICS = 'SYNC_ANTIBIOTICS';
const FETCH_ANTIBIOTICS_FAILED = 'FETCH_ANTIBIOTICS_FAILED';

// TODO: Abstract this to a helper function
const antibioticMapper = props => ({
  ...props,
  remoteId: props.id,
  packSize: props.pack_size,
  strengthValue: props.strength_value,
  strengthUnit: props.strength_unit
});

export const syncAntibiotics = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SYNC_ANTIBIOTICS });
  dispatch(
    remoteSync('/api/v1/antibiotics', user, 'Antibiotic', antibioticMapper)
  );
};

export const fetchAntibiotics = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Antibiotic } = await db.initializeForUser(user);
  dispatch({ type: FETCH_ANTIBIOTICS });
  const totalCount = await Antibiotic.count();
  Antibiotic.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_ANTIBIOTICS, items, totalCount }))
    .catch(error => dispatch({ type: FETCH_ANTIBIOTICS_FAILED, error }));
};

export { FETCH_ANTIBIOTICS, FETCHED_ANTIBIOTICS, FETCH_ANTIBIOTICS_FAILED };
