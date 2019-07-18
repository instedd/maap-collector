import db from '../db';
import { remoteSync } from './sync';

const FETCH_CULTURE_TYPES = 'FETCH_CULTURE_TYPES';
const FETCHED_CULTURE_TYPES = 'FETCHED_CULTURE_TYPES';
const FETCHED_CULTURE_TYPES_FAILED = 'FETCHED_CULTURE_TYPES_FAILED';
const SYNC_CULTURE_TYPES = 'SYNC_CULTURE_TYPES';
const SYNC_CULTURE_TYPES_FAILED = 'SYNC_CULTURE_TYPES_FAILED';

// TODO: Abstract this to a helper function
const cultureTypeMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncCultureTypes = () => async (dispatch, getState) => {
  const { user } = getState();

  dispatch({ type: SYNC_CULTURE_TYPES });
  return dispatch(
    remoteSync('/api/v1/culture_types', user, 'CultureType', cultureTypeMapper)
  );
};

export const fetchCultureType = () => async (dispatch, getState) => {
  const { user } = getState();
  const { CultureType } = await db.initializeForUser(user);

  dispatch({ type: FETCH_CULTURE_TYPES });
  CultureType.findAll()
    .then(cultureType =>
      dispatch({ type: FETCHED_CULTURE_TYPES, items: cultureType })
    )
    .catch(e => dispatch({ type: FETCHED_CULTURE_TYPES_FAILED, error: e }));
};

export {
  SYNC_CULTURE_TYPES,
  SYNC_CULTURE_TYPES_FAILED,
  FETCHED_CULTURE_TYPES,
  FETCH_CULTURE_TYPES,
  FETCHED_CULTURE_TYPES_FAILED
};
