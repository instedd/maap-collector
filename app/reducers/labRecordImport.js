import {
  SET_IMPORT_DATA,
  SET_PHI_DATA,
  SET_PATIENT_ID_DATA,
  SET_FILE_DATA,
  CLEAN_LAB_RECORD_IMPORT
} from '../actions/labRecordImport';
import type { Action } from './types';

const initialState = {
  file: null,
  headerRow: '',
  dataRowsFrom: '',
  dataRowsTo: '',
  columns: [],
  rows: [],
  patientOrLabRecordId: [],
  phi: [],
  date: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case SET_PHI_DATA:
      return { ...state, ...action.data };
    case SET_PATIENT_ID_DATA:
      return { ...state, ...action.data };
    case SET_FILE_DATA:
      return { ...state, ...action.data };
    case SET_IMPORT_DATA:
      return { ...state, ...action.data };
    case CLEAN_LAB_RECORD_IMPORT:
      return initialState;
    default:
      return state;
  }
}
