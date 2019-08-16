// @flow

import { SAVING_PATIENT_FAILED, SAVED_PATIENT } from '../actions/patient';
import type { State, Action } from './types';

const initialState = {
  errors: []
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case SAVED_PATIENT:
      return { ...state, errors: [] };
    case SAVING_PATIENT_FAILED:
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}
