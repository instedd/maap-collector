// @flow
import {
  SYNC_START,
  SYNC_FINISH,
  UPDATE_PENDING_COUNT,
  UPDATE_PENDING_UPLOAD_COUNT,
  REDUCE_PENDING_COUNT,
  REDUCE_PENDING_UPLOAD_COUNT
} from '../actions/sync';
import type { Action } from './types';

type State = {
  synchronizing: boolean
};

const initialState: State = {
  synchronizing: false
};

export default function network(state: State = initialState, action: Action) {
  switch (action.type) {
    case REDUCE_PENDING_COUNT:
      return {
        ...state,
        [`${action.entity}Count`]:
          state[`${action.entity}Count`] - (action.count || 1)
      };
    case REDUCE_PENDING_UPLOAD_COUNT:
      return {
        ...state,
        [`${action.entity}UploadCount`]:
          state[`${action.entity}UploadCount`] - (action.count || 1)
      };
    case UPDATE_PENDING_COUNT:
      return { ...state, [`${action.entity}Count`]: action.count };
    case UPDATE_PENDING_UPLOAD_COUNT:
      return { ...state, [`${action.entity}UploadCount`]: action.count };
    case SYNC_START:
      return { ...state, synchronizing: true };
    case SYNC_FINISH:
      return { ...state, synchronizing: false };
    default:
      return state;
  }
}
