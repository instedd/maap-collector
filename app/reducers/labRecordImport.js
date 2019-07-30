import { SET_FILE_DATA, SET_PHI_DATA } from '../actions/labRecordImport';
import type { Action } from './types';

const initialState = {
  file: null,
  headerRow: '',
  dataRowsFrom: '',
  dataRowsTo: '',
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
    default:
      return state;
  }
}
