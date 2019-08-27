import camelCaseKeys from 'camelcase-keys';
import { omit } from 'lodash';
import { remoteSync } from './sync';
import { fetchEntity } from './fetch';

const FETCH_SITES = 'FETCH_SITES';
const FETCHED_SITES = 'FETCHED_SITES';
const SITES_SYNC = 'SITES_SYNC';
const FETCH_SITES_FAILED = 'FETCH_SITES_FAILED';

// TODO: Abstract this to a helper function
const siteMapper = props =>
  omit(
    camelCaseKeys({
      ...props,
      remoteId: props.id
    }),
    ['id', 'createdAt', 'updatedAt']
  );

export const syncSites = () => async (dispatch, getState) => {
  const { user } = getState();
  dispatch({ type: SITES_SYNC });
  return dispatch(remoteSync('/api/v1/sites', user, 'Site', siteMapper)).then(
    () => dispatch(fetchSites())
  );
};

export const fetchSites = fetchEntity('Site');

export { FETCH_SITES, FETCHED_SITES, FETCH_SITES_FAILED };
