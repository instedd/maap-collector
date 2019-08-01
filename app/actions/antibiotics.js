import { remoteSync } from './sync';
import { fetchEntity } from './fetch';

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
  return dispatch(
    remoteSync('/api/v1/antibiotics', user, 'Antibiotic', antibioticMapper)
  );
};

export const fetchAntibiotics = fetchEntity('Antibiotic');

export { FETCH_ANTIBIOTICS, FETCHED_ANTIBIOTICS, FETCH_ANTIBIOTICS_FAILED };
