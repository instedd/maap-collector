// @flow

import { FETCHED_PATIENT_ENTRIES } from '../actions/patientEntries';
import { FETCHED_PATIENT } from '../actions/patient';
import type { State, Action } from './types';

const initialState = {
  patientDisplayId: null,
  patientEntries: {
    items: []
  }
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_PATIENT_ENTRIES:
      return {
        ...state,
        patientEntries: action
      };
    case FETCHED_PATIENT:
      return {
        ...state,
        patientDisplayId:
          action.patient.patientId || action.patient.remotePatientId
      };
    default:
      return state;
  }
}
