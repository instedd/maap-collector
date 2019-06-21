import { NETWORK_ONLINE, NETWORK_OFFLINE } from '../actions/network';
import type { Action } from './types';

const initialState = {
  online: true
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case NETWORK_ONLINE:
      return { ...state, online: true };
    case NETWORK_OFFLINE:
      return { ...state, online: false };
    default:
      return state;
  }
}
