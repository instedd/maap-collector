// @flow

import { CREATING_ANTIBIOTIC, CREATED_ANTIBIOTIC } from '../actions/antibiotic';
import type { State, Action } from './types';

const initialState = {
  errors: []
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case CREATED_ANTIBIOTIC:
      return { ...state, errors: [] };
    case CREATING_ANTIBIOTIC:
      return { ...state, errors: action.errors || [] };
    default:
      return state;
  }
}
