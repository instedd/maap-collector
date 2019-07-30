import { FETCHED_LAB_RECORDS } from '../actions/labRecords';
import type { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_LAB_RECORDS:
      return { ...state, items: action.items, totalCount: action.totalCount };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
