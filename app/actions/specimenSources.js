import db from '../db';
import { remoteSync } from './sync';

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
  dispatch({ type: SYNC_SPECIMEN_SOURCES });
  return dispatch(
    remoteSync(
      '/api/v1/specimen_sources',
      user,
      'SpecimenSource',
      specimenSourcesMapper
    )
  );
};

export const fetchSpecimenSources = () => async (dispatch, getState) => {
  const { user } = getState();
  const { SpecimenSource } = await db.initializeForUser(user);

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
