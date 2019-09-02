import { MIGRATIONS_RAN } from '../actions/migrations';
import type { Action } from './types';

const initialState = {
  ran: false
};

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case MIGRATIONS_RAN:
      return { ran: true };
    default:
      return state;
  }
}
