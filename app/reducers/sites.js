import { SITES_FETCHED } from '../actions/sites';
import type { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case SITES_FETCHED:
      return { ...state, ...action };
    default:
      return state;
  }
}
