import { FETCHED_ANTIBIOTIC_CONSUMPTION_STATS } from '../actions/antibioticConsumptionStats';
import type { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTIC_CONSUMPTION_STATS:
      return { ...state, items: action.items, totalCount: action.totalCount };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
