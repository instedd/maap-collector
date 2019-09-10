import {
  FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORDS,
  FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORD
} from '../actions/electronicPharmacyStockRecords';
import type { Action } from './types';

const initialState = {
  items: []
};

export default function counter(state = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORDS:
      return { ...state, ...action };
    case FETCHED_ELECTRONIC_PHARMACY_STOCK_RECORD:
      return { ...state, electronicPharmacyStockRecord: action.item };
    default:
      return state;
  }
}
