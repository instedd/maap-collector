// import { LAB_FIELD_UPDATE, LAB_FIELD_UPDATED } from '../actions/lab';
import type { Action } from './types';

const initialState = {};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    // case LAB_FIELD_UPDATE:
    //   return { ...state, ...action.changes };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
