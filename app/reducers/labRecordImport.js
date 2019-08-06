import {
  SET_FILE_DATA,
  SET_PHI_DATA,
  SET_PATIENT_ID_DATA
} from '../actions/labRecordImport';
import type { Action } from './types';

const initialState = {
  file: null,
  headerRow: '3',
  dataRowsFrom: '4',
  dataRowsTo: '34',
  columns: [],
  rows: [],
  patientOrLabRecordId: {},
  phi: {},
  date: {}
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case SET_FILE_DATA:
      return { ...state, ...action.data };
    case SET_PHI_DATA:
      return { ...state, ...action.data };
    case SET_PATIENT_ID_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}
