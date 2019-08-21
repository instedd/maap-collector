// @flow
import { FETCHED_ANTIBIOTIC } from '../actions/antibiotic';
import { FETCHED_ANTIBIOTIC_CONSUMPTION_STATS } from '../actions/antibioticConsumptionStats';
import type { Action, State } from './types';

const initialState = {
  antibioticName: null,
  antibioticConsumptionStats: {
    items: [],
    totalCount: 0,
    totalPages: 0,
    offset: 0,
    limit: 0,
    prevPage: 0,
    nextPage: 0
  }
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTIC:
      return { ...state, antibioticName: action.antibiotic.name };
    case FETCHED_ANTIBIOTIC_CONSUMPTION_STATS:
      return { ...state, antibioticConsumptionStats: action };
    default:
      return state;
  }
}
