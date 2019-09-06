import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../actions/user';
import type { Action } from './types';

const initialState = {};

export const isLoggedIn = user => !!user.auth;

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        data: action.user,
        lastUserLoggedIn: action.user.response && action.user.response.id,
        lastUserEmailLoggedIn: action.user.response.uid,
        auth: action.user.response && {
          'access-token': action.user.response['access-token'],
          client: action.user.response.client,
          expiry: action.user.response.expiry,
          uid: action.user.response.uid
        }
      };
    case USER_LOGGED_OUT:
      return {
        ...state,
        data: {
          response: {
            ...state.data.response,
            'access-token': null,
            client: null
          }
        },
        auth: null
      };
    default:
      return state;
  }
}
