// @flow
import { FETCHED_ANTIBIOTIC } from '../actions/antibiotic';
import type { Action, State } from './types';

const initialState = null;

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTIC:
      return action.antibiotic;
    default:
      return state;
  }
}
