import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { throttle } from 'lodash';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './app.global.scss';

import { setNetworkOnline, setNetworkOffline } from './actions/network';
import { loadState, saveState } from './utils/localStorage';
import { syncStart } from './actions/sync';
import { NAME } from './constants/config';

const persistedState = loadState();
const store = configureStore({ preloadedState: persistedState });

store.subscribe(
  throttle(() => {
    saveState({
      // user: { ...store.getState().user, auth: null, response: null },
      user: store.getState().user,
      site: store.getState().site
    });
  }, 1000)
);

window.addEventListener('online', () => store.dispatch(setNetworkOnline()));
window.addEventListener('offline', () => store.dispatch(setNetworkOffline()));
document.title = `MAAP Data Collector - ${NAME}`;
if (!navigator.onLine) store.dispatch(setNetworkOffline());
if (store.getState().user.data)
  setTimeout(() => store.dispatch(syncStart()), 300);

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
