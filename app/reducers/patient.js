// @flow

import {
  SAVING_PATIENT_FAILED,
  SAVED_PATIENT,
  FETCHED_PATIENT
} from '../actions/patient';
import type { Action } from './types';

const initialState = {
  errors: [],
  dbPatient: null
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SAVED_PATIENT:
      return { ...state, errors: [] };
    case SAVING_PATIENT_FAILED:
      return { ...state, errors: action.errors };
    case FETCHED_PATIENT:
      return {
        dbPatient: action.patient,
        errors: []
      };
    default:
      return state;
  }
}
