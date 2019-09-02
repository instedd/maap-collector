// @flow
import { FETCHED_ANTIBIOTIC } from '../actions/antibiotic';
import {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED,
  ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST
} from '../actions/antibioticConsumptionStats';
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
  const { antibioticConsumptionStats } = state;
  switch (action.type) {
    case FETCHED_ANTIBIOTIC:
      return { ...state, antibioticName: action.antibiotic.name };
    case FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED:
      return { ...state, antibioticConsumptionStats: action };
    case ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST:
      return {
        ...state,
        antibioticConsumptionStats: {
          ...antibioticConsumptionStats,
          totalCount: antibioticConsumptionStats.totalCount + 1,
          limit: antibioticConsumptionStats.limit + 1,
          items: [...antibioticConsumptionStats.items, action.newEntry]
        }
      };
    default:
      return state;
  }
}
