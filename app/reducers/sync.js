import { SYNC_START } from '../actions/sync';
import type { Action } from './types';

const initialState = {
  synchronizing: false
};

export default function network(state = initialState, action: Action) {
  switch (action.type) {
    case SYNC_START:
      return { ...state, synchronizing: true };
    default:
      return state;
  }
}
