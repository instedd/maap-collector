// @flow
import { FETCHED_ANTIBIOTIC } from '../actions/antibiotic';
import type { Action, State } from './types';

const initialState = null;

// reducer en vez de counter???
export default function counter(state: State = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTIC:
      return action.antibiotic;
    default:
      return state;
  }
}
