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

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const NonPrivateRoute = connect(mapStateToProps)(
  ({ component: Component, path, user }) => (
    <Route
      exact
      path={path}
      render={props =>
        user.data ? <Redirect to={routes.HOME} /> : <Component {...props} />
      }
    />
  )
);

const PrivateRoute = connect(mapStateToProps)(
  ({ component: Component, path, user }) => (
    <Route
      exact
      path={path}
      render={props =>
        user.data ? <Component {...props} /> : <Redirect to={routes.SIGN_IN} />
      }
    />
  )
);

const Router = () => (
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
      <PrivateRoute exact path="/patients" component={PatientsIndex} />
      <PrivateRoute
        exact
        path="/patients/:id/entries"
        component={PatientEntriesIndex}
      />
      <PrivateRoute
        exact
        path="/patients/:id/entries/:patientEntryId/edit"
        component={PatientEntriesEdit}
      />
      <PrivateRoute
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
    </Switch>
  </App>
);

export default withRouter(connect(mapStateToProps)(Router));
