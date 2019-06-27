// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import type { Store } from '../reducers/types';
import Routes from '../Routes';
import { userLoggedIn } from '../actions/user';
import { syncStart } from '../actions/sync';

type Props = {
  store: Store,
  history: {},
  network: {},
  lab: {}
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;
    setTimeout(() => store.dispatch(userLoggedIn()), 600);
    setTimeout(() => store.dispatch(syncStart()), 900);
    // setTimeout(() => store.dispatch(labCreate({name: "test"})), 900)
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}
