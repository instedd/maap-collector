import { ENTER_FACILITY, EXIT_FACILITY } from '../actions/facility';
import type { Action } from './types';

const initialState = null;

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case ENTER_FACILITY:
      return action.facility;
    case EXIT_FACILITY:
      return null;
    // case LAB_FIELD_UPDATE:
    //   return { ...state, ...action.changes };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
