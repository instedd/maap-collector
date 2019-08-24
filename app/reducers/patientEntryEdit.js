import {
  FETCHED_PATIENT_ENTRY,
  SAVED_PATIENT_ENTRY,
  CLEAN_PATIENT_ENTRY
} from '../actions/patientEntry';
import type { Action } from './types';

const initialState = {
  item: null
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case CLEAN_PATIENT_ENTRY:
      return initialState;
    case SAVED_PATIENT_ENTRY:
      return { ...state, item: action.record };
    case FETCHED_PATIENT_ENTRY:
      return { ...state, item: action.item };
    default:
      return state;
  }
}
