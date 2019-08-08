import db from '../db';
import { remoteSync } from './sync';

const SITES_FETCH = 'SITES_FETCH';
const SITES_FETCHED = 'SITES_FETCHED';
const SITES_SYNC = 'SITES_SYNC';
const SITES_FETCH_FAILED = 'SITES_FETCH_FAILED';

// TODO: Abstract this to a helper function
const siteMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncSites = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SITES_SYNC });
  return dispatch(remoteSync('/api/v1/sites', user, 'Site', siteMapper));
};

export const fetchSites = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Site } = await db.initializeForUser(user);
  dispatch({ type: SITES_FETCH });
  const totalCount = await Site.count();
  Site.findAll({ limit: 15 })
    .then(items => dispatch({ type: SITES_FETCHED, items, totalCount }))
    .catch(error => dispatch({ type: SITES_FETCH_FAILED, error }));
};

export { SITES_FETCH, SITES_FETCHED, SITES_FETCH_FAILED };
