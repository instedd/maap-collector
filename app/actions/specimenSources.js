import db from '../db';
import { fetchPaginated } from '../utils/fetch';

const FETCH_SPECIMEN_SOURCES = 'FETCH_SPECIMEN_SOURCES';
const FETCHED_SPECIMEN_SOURCES = 'FETCHED_SPECIMEN_SOURCES';
const FETCHED_SPECIMEN_SOURCES_FAILED = 'FETCHED_SPECIMEN_SOURCES_FAILED';
const SYNC_SPECIMEN_SOURCES = 'SYNC_SPECIMEN_SOURCES';
const SYNC_SPECIMEN_SOURCES_FAILED = 'SYNC_SPECIMEN_SOURCES_FAILED';

// TODO: Abstract this to a helper function
const specimenSourcesMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncSpecimenSources = () => async (dispatch, getState) => {
  const { user } = getState();
  const { SpecimenSource } = db.initializeForUser(user);
  dispatch({ type: SYNC_SPECIMEN_SOURCES });
  fetchPaginated('/api/v1/specimen_sources', user.auth)
    .then(res =>
      res.map(async item => {
        const mapper = specimenSourcesMapper(item);
        return (
          SpecimenSource.findOrBuild({ where: { id: mapper.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([specimenSource]) => specimenSource.update(mapper))
            .catch(e => console.log(e))
        );
      })
    )
    .catch(error => dispatch({ type: SYNC_SPECIMEN_SOURCES_FAILED, error }));
};

export const fetchSpecimenSources = () => async (dispatch, getState) => {
  const { user } = getState();
  const { SpecimenSource } = db.initializeForUser(user);

  dispatch({ type: FETCH_SPECIMEN_SOURCES });
  SpecimenSource.findAll()
    .then(specimenSources =>
      dispatch({ type: FETCHED_SPECIMEN_SOURCES, items: specimenSources })
    )
    .catch(e => dispatch({ type: FETCHED_SPECIMEN_SOURCES_FAILED, error: e }));
};

export {
  SYNC_SPECIMEN_SOURCES,
  SYNC_SPECIMEN_SOURCES_FAILED,
  FETCHED_SPECIMEN_SOURCES,
  FETCH_SPECIMEN_SOURCES,
  FETCHED_SPECIMEN_SOURCES_FAILED
};
