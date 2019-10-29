// @flow
import { FETCHED_ANTIBIOTIC } from '../actions/antibiotic';
import {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED,
  ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST,
  CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST
} from '../actions/antibioticConsumptionStats';
import type { Action, State } from './types';

const initialState = {
  antibioticName: null,
  antibiotic: {
    strength: null,
    form: null,
    name: null,
    packSize: null,
    brand: null
  },
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
  const { antibioticConsumptionStats } = state;
  let newItems;
  switch (action.type) {
    case FETCHED_ANTIBIOTIC:
      return {
        ...state,
        antibioticName: action.antibiotic.name,
        antibiotic: action.antibiotic
      };
    case FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED:
      return { ...state, antibioticConsumptionStats: action };
    case ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST:
      newItems = [...antibioticConsumptionStats.items, action.newEntry];
      return {
        ...state,
        antibioticConsumptionStats: {
          ...antibioticConsumptionStats,
          totalCount: antibioticConsumptionStats.totalCount + 1,
          limit: Math.max(antibioticConsumptionStats.limit, newItems.length),
          items: newItems
        }
      };
    case CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST:
      return initialState;
    default:
      return state;
  }
}
