import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Login from './containers/Login';
import AntibioticsIndex from './containers/AntibioticsIndex';
import AntibioticsDetail from './containers/AntibioticsDetail';
import PatientsIndex from './containers/PatientsIndex';
import PatientEntriesIndex from './containers/PatientEntriesIndex';
import PatientEntriesNew from './containers/PatientEntriesNew';
import PatientEntriesEdit from './containers/PatientEntriesEdit';
import LabRecordsImport from './containers/LabRecordsImport';
import LabRecordsDetail from './containers/LabRecordsDetail';
import ElectronicPharmacyStockRecordsIndex from './containers/ElectronicPharmacyStockRecordsIndex';
import ElectronicPharmacyStockRecordImport from './containers/ElectronicPharmacyStockRecordImport';
import ElectronicPharmacyStockRecordDetail from './containers/ElectronicPharmacyStockRecordDetail';

const mapStateToProps = state => {
  const { user, site } = state;
  return { user, site };
};

const NonPrivateRoute = connect(mapStateToProps)(
  ({ component: Component, path, user }) => (
    <Route
      exact
      path={path}
      render={props =>
        user.auth ? <Redirect to={routes.HOME} /> : <Component {...props} />
      }
    />
  )
);

const PrivateRoute = connect(mapStateToProps)(
  ({ component: Component, path, user, enabled = true }) => (
    <Route
      exact
      path={path}
      render={props =>
        user.auth && enabled ? (
          <Component {...props} />
        ) : (
          <Redirect to={routes.SIGN_IN} />
        )
      }
    />
  )
);

const Router = ({ site }: { site: * }) => (
  <App>
    <Switch>
      <NonPrivateRoute exact path={routes.SIGN_IN} component={Login} />
      <PrivateRoute exact path={routes.HOME} component={HomePage} />
      <PrivateRoute
        exact
        path={routes.ANTIBIOTIC_CONSUMPTION_DATA_INDEX}
        component={AntibioticsIndex}
      />
      <PrivateRoute
        exact
        path="/antibiotics/:id"
        component={AntibioticsDetail}
      />
      <PrivateRoute
        enabled={site && site.hasHospital}
        exact
        path="/patients"
        component={PatientsIndex}
      />
      <PrivateRoute
        enabled={site && site.hasHospital}
        exact
        path="/patients/:id/entries"
        component={PatientEntriesIndex}
      />
      <PrivateRoute
        enabled={site && site.hasHospital}
        exact
        path="/patients/:id/entries/:patientEntryId/edit"
        component={PatientEntriesEdit}
      />
      <PrivateRoute
        enabled={site && site.hasHospital}
        exact
        path="/patients/:id/entries/new"
        component={PatientEntriesNew}
      />
      <PrivateRoute
        exact
        path="/lab_records/import"
        component={LabRecordsImport}
      />
      <PrivateRoute
        exact
        path="/lab_records/:id"
        component={LabRecordsDetail}
      />
      <PrivateRoute
        exact
        path="/electronic_pharmacy_stock_records"
        component={ElectronicPharmacyStockRecordsIndex}
      />
      <PrivateRoute
        exact
        path="/electronic_pharmacy_stock_records/import"
        component={ElectronicPharmacyStockRecordImport}
      />
      <PrivateRoute
        exact
        path="/electronic_pharmacy_stock_records/:id"
        component={ElectronicPharmacyStockRecordDetail}
      />
    </Switch>
  </App>
);

export default withRouter(connect(mapStateToProps)(Router));
