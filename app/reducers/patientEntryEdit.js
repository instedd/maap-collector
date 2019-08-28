import {
  FETCHED_PATIENT_ENTRY,
  SAVED_PATIENT_ENTRY,
  CLEAN_PATIENT_ENTRY,
  PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS
} from '../actions/patientEntry';
import type { Action } from './types';

const initialState = {
  item: null,
  antibioticOptions: null
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case CLEAN_PATIENT_ENTRY:
      return initialState;
    case SAVED_PATIENT_ENTRY:
      return { ...state, item: action.record };
    case FETCHED_PATIENT_ENTRY:
      return { ...state, item: action.item };
    case PATIENT_ENTRY_FORM_LOAD_ANTIBIOTICS:
      return { ...state, antibioticOptions: action.antibioticOptions };
    default:
      return state;
  }
}
