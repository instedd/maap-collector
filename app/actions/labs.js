import db from '../db';
import { fetchPaginated } from '../utils/fetch';

const FETCH_LABS = 'FETCH_LABS';
const FETCH_LABS_FAILED = 'FETCH_LABS_FAILED';

// TODO: Abstract this to a helper function
const labMapper = props => ({
  ...props,
  remoteId: props.id
});

export const fetchLabs = () => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = db.initializeForUser(user);
  fetchPaginated('http://localhost:3000/api/v1/labs', user.auth)
    .then(res =>
      res.map(async item => {
        const mapper = labMapper(item);
        return (
          Lab.findOrBuild({ where: { id: mapper.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([lab]) => lab.update(mapper))
            .catch(e => console.log(e))
        );
      })
    )
    .catch(error => dispatch({ type: FETCH_LABS_FAILED, error }));
};

export { FETCH_LABS, FETCH_LABS_FAILED };
