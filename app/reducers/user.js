import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../actions/user';
import type { Action } from './types';

const initialState = {};

export default function network(state = initialState, action: Action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      console.log(action.user);
      return {
        ...state,
        data: action.user,
        auth: {
          'access-token': action.user.response['access-token'],
          client: action.user.response.client,
          expiry: action.user.response.expiry,
          uid: action.user.response.uid
        }
      };
    case USER_LOGGED_OUT:
      return { ...state, data: null, auth: null };
    default:
      return state;
  }
}
