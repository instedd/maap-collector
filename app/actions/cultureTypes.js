import db from '../db';
import { fetchPaginated } from '../utils/fetch';

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
  const { CultureType } = db.initializeForUser(user);
  dispatch({ type: SYNC_CULTURE_TYPES });
  fetchPaginated('/api/v1/culture_types', user.auth)
    .then(res =>
      res.map(async item => {
        const mapper = cultureTypeMapper(item);
        return (
          CultureType.findOrBuild({ where: { id: mapper.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([specimenSource]) => specimenSource.update(mapper))
            .catch(e => console.log(e))
        );
      })
    )
    .catch(error => dispatch({ type: SYNC_CULTURE_TYPES_FAILED, error }));
};

export const fetchCultureType = () => async (dispatch, getState) => {
  const { user } = getState();
  const { CultureType } = db.initializeForUser(user);

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
