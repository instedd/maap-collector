import { SITE_ENTER, SITE_EXIT } from '../actions/site';
import type { Action } from './types';

const initialState = null;

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case SITE_ENTER:
      return action.site;
    case SITE_EXIT:
      return null;
    default:
      return state;
  }
}
