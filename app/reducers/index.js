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
import antibiotics from './antibiotics';
import antibioticConsumptionStatsList from './antibioticConsumptionStatsList';
import patients from './patients';
import patient from './patient';
import patientEntryEdit from './patientEntryEdit';
import patientEntriesList from './patientEntriesList';
import enumReducer from './enums';

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
      antibiotics,
      antibioticConsumptionStatsList,
      patient,
      patients,
      patientEntryEdit,
      patientEntriesList,
      PatientLocation: enumReducer('PatientLocation')
    })
  );
}
