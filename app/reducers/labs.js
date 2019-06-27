// import { FETCH_LABS } from '../actions/labs';
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
