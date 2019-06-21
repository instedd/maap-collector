import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../actions/user';
import type { Action } from './types';

const initialState = {};

export default function network(state = initialState, action: Action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return { ...state, data: action.user };
    case USER_LOGGED_OUT:
      return { ...state, data: null };
    default:
      return state;
  }
}
