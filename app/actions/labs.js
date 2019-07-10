import db from '../db';
import { remoteSync } from './sync';

const FETCH_LABS = 'FETCH_LABS';
const FETCHED_LABS = 'FETCHED_LABS';
const SYNC_LABS = 'SYNC_LABS';
const FETCH_LABS_FAILED = 'FETCH_LABS_FAILED';

// TODO: Abstract this to a helper function
const labMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncLabs = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SYNC_LABS });
  dispatch(remoteSync('/api/v1/labs', user, 'Lab', labMapper));
};

export const fetchLabs = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = db.initializeForUser(user);
  dispatch({ type: FETCH_LABS });
  const totalCount = await Lab.count();
  Lab.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_LABS, items, totalCount }))
    .catch(error => dispatch({ type: FETCH_LABS_FAILED, error }));
};

export { FETCH_LABS, FETCHED_LABS, FETCH_LABS_FAILED };
