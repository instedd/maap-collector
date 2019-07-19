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
import PatientsNew from './containers/PatientsNew';
// import NewAntibioticConsumptionStat from './containers/NewAntibioticConsumptionStat';

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
      <PrivateRoute exact path="/patients/new" component={PatientsNew} />
    </Switch>
  </App>
);

export default withRouter(connect(mapStateToProps)(Router));
