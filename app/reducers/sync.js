// @flow
import { SYNC_START, SYNC_FINISH } from '../actions/sync';
import type { Action } from './types';

type State = {
  synchronizing: boolean
};

const initialState: State = {
  synchronizing: false
};

export default function network(state: State = initialState, action: Action) {
  switch (action.type) {
    case SYNC_START:
      return { ...state, synchronizing: true };
    case SYNC_FINISH:
      return { ...state, synchronizing: false };
    default:
      return state;
  }
}
