import db from '../db';
import { syncStart } from './sync';
import { API_URL } from '../constants/config';

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
const REQUEST_LOGIN = 'REQUEST_LOGIN';
const USER_LOGGED_IN_FAILURE = 'USER_LOGGED_IN_FAILURE';

export const requestLogin = (username, password) => dispatch => {
  // TODO: Support for offline login
  dispatch({ type: 'REQUEST_LOGIN' });
  fetch(`${API_URL}/api/v1/auth/sign_in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: username,
      password
    })
  })
    .then(response => {
      if (response.status === 200) return response.json();
      return Promise.reject(new Error('Unauthorized'));
    })
    .then(response => dispatch(userLoggedIn({ username, password, response })))
    .catch(e => dispatch(userLoggedInFailure(e)));
};

export const userLoggedIn = user => dispatch => {
  db.initializeForUser({ data: user });
  dispatch({ type: 'USER_LOGGED_IN', user });
  setTimeout(() => dispatch(syncStart()), 600);
};

export const userLoggedInFailure = error => ({
  type: 'USER_LOGGED_IN_FAILURE',
  error
});

// TODO: Decide what to do with the old database
export const userLoggedOut = user => ({ type: 'USER_LOGGED_OUT', user });

export {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  REQUEST_LOGIN,
  USER_LOGGED_IN_FAILURE
};
