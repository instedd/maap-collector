// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import network from './network';
import user from './user';
import site from './site';
import sites from './sites';
import labRecords from './labRecords';
import labRecordImport from './labRecordImport';
import sync from './sync';
import specimenSources from './specimenSources';
import antibioticConsumptionStats from './antibioticConsumptionStats';
import antibiotics from './antibiotics';
import patients from './patients';
import patientEntries from './patientEntries';

export default function createRootReducer(history: {}) {
  const routerReducer = connectRouter(history)(() => {});

  return connectRouter(history)(
    combineReducers({
      router: routerReducer,
      network,
      user,
      site,
      sites,
      labRecordImport,
      labRecords,
      sync,
      specimenSources,
      antibioticConsumptionStats,
      antibiotics,
      patients,
      patientEntries
    })
  );
}
