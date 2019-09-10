// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import type { Store } from '../reducers/types';
import AppEntryPoint from './AppEntryPoint';

type Props = {
  store: Store,
  history: {},
  network: {},
  site: {}
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <AppEntryPoint history={history} />
      </Provider>
    );
  }
}
