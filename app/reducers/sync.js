import {
  SYNC_START,
  UPDATE_PENDING_COUNT,
  REDUCE_PENDING_COUNT
} from '../actions/sync';
import type { Action } from './types';

const initialState = {
  synchronizing: false
};

export default function network(state = initialState, action: Action) {
  switch (action.type) {
    case REDUCE_PENDING_COUNT:
      return {
        ...state,
        [`${action.entity}Count`]:
          state[`${action.entity}Count`] - (action.count || 1)
      };
    case UPDATE_PENDING_COUNT:
      return { ...state, [`${action.entity}Count`]: action.count };
    case SYNC_START:
      return { ...state, synchronizing: true };
    default:
      return state;
  }
}
