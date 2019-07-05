import {
  FETCH_SPECIMEN_SOURCES,
  FETCHED_SPECIMEN_SOURCES,
  FETCHED_SPECIMEN_SOURCES_FAILED
} from '../actions/specimenSources';
import type { Action } from './types';

const initialState = {};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCH_SPECIMEN_SOURCES:
      return { ...state, loading: true };
    case FETCHED_SPECIMEN_SOURCES:
      return { ...state, items: action.items, loading: false };
    case FETCHED_SPECIMEN_SOURCES_FAILED:
      return { ...state, items: [], loading: false };
    default:
      return state;
  }
}
