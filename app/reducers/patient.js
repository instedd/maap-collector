import { SAVING_PATIENT_FAILED } from '../actions/patient';
import type { Action } from './types';

const initialState = {
  errors: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case SAVING_PATIENT_FAILED:
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}
