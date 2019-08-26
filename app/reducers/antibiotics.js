// @flow
import { FETCHED_ANTIBIOTICS } from '../actions/antibiotics';
import { Action, State } from './types';

const initialState = {
  items: []
};

export default function counter(state: State = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ANTIBIOTICS:
      return { ...state, ...action };
    // case LAB_FIELD_UPDATED:
    //   return { ...state };
    default:
      return state;
  }
}
