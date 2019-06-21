// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import type { Store } from '../reducers/types';
import Routes from '../Routes';
// import { userLoggedIn, userLoggedOut } from '../actions/user'

type Props = {
  store: Store,
  history: {},
  network: {}
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;
    // setTimeout(() => store.dispatch(userLoggedIn()), 600)
    // setTimeout(() => store.dispatch(userLoggedOut()), 4600)
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}
