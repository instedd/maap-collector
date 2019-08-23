// @flow
import snakecaseKeys from 'snakecase-keys';
import { remoteSync, remoteUpload } from './sync';
import { fetchEntity } from './fetch';
import type { Dispatch, State } from '../reducers/types';

const FETCH_ANTIBIOTICS = 'FETCH_ANTIBIOTICS';
const FETCHED_ANTIBIOTICS = 'FETCHED_ANTIBIOTICS';
const FETCH_ANTIBIOTICS_FAILED = 'FETCH_ANTIBIOTICS_FAILED';

const UPLOAD_ANTIBIOTICS = 'UPLOAD_ANTIBIOTICS';
const SYNC_ANTIBIOTICS = 'SYNC_ANTIBIOTICS';

// TODO: Abstract this to a helper function
const antibioticMapper = props => ({
  ...props,
  remoteId: props.id,
  packSize: props.pack_size,
  strengthValue: props.strength_value,
  strengthUnit: props.strength_unit
});

const uploadMapper = async props => ({
  ...snakecaseKeys(props.dataValues),
  id: props.dataValues.remoteId
});

export const syncAntibiotics = () => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  const { user } = getState();
  dispatch({ type: SYNC_ANTIBIOTICS });
  return dispatch(
    remoteSync('/api/v1/antibiotics', user, 'Antibiotic', antibioticMapper)
  )
    .then(() => dispatch(uploadAntibiotics()))
    .then(() => dispatch(fetchAntibiotics()));
};
export const uploadAntibiotics = () => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_ANTIBIOTICS });
  await dispatch(
    remoteUpload('/api/v1/antibiotics', user, 'Antibiotic', uploadMapper)
  );
};

export const fetchAntibiotics = fetchEntity('Antibiotic');

export { FETCH_ANTIBIOTICS, FETCHED_ANTIBIOTICS, FETCH_ANTIBIOTICS_FAILED };
