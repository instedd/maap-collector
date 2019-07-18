import { FETCHED_ANTIBIOTICS } from '../actions/antibiotics';
import { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTICS:
      return { ...state, items: action.items, totalCount: action.totalCount };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
