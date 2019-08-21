import { FETCHED_SITES } from '../actions/sites';
import type { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_SITES:
      return { ...state, ...action };
    default:
      return state;
  }
}
