import db from '../db';
import { fetchPaginated } from '../utils/fetch';

const FETCH_LABS = 'FETCH_LABS';
const FETCHED_LABS = 'FETCHED_LABS';
const SYNC_LABS = 'SYNC_LABS';
const SYNC_LABS_FAILED = 'SYNC_LABS_FAILED';
const FETCH_LABS_FAILED = 'FETCH_LABS_FAILED';

// TODO: Abstract this to a helper function
const labMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncLabs = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = db.initializeForUser(user);
  dispatch({ type: SYNC_LABS });
  fetchPaginated('/api/v1/labs', user.auth, (res =>
      res.forEach(async item => {
        const mapper = labMapper(item);
        return (
          Lab.findOrBuild({ where: { id: mapper.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([lab]) => lab.update(mapper))
            .catch(e => console.log(e))
        );
      })
    ))
    // .catch(error => dispatch({ type: SYNC_LABS_FAILED, error }));
};

export const fetchLabs = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = db.initializeForUser(user);
  dispatch({ type: FETCH_LABS });
<<<<<<< Updated upstream
  const totalCount = await Lab.count();
  Lab.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_LABS, items, totalCount }))
=======
  Lab.findAll({ limit: 15 })
    .then(items => dispatch({ type: FETCHED_LABS, items }))
>>>>>>> Stashed changes
    .catch(error => dispatch({ type: FETCH_LABS_FAILED, error }));
};

export { FETCH_LABS, FETCHED_LABS, FETCH_LABS_FAILED };
