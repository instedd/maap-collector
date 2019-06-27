// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import network from './network';
import user from './user';
import lab from './lab';
import labs from './labs';
import sync from './sync';

export default function createRootReducer(history: {}) {
  const routerReducer = connectRouter(history)(() => {});

  return connectRouter(history)(
    combineReducers({ router: routerReducer, network, user, lab, labs, sync })
  );
}
