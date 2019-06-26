import db from '../db';

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
const REQUEST_LOGIN = 'REQUEST_LOGIN';
const USER_LOGGED_IN_FAILURE = 'USER_LOGGED_IN_FAILURE';

export const requestLogin = (username, password) => (dispatch) => {
  dispatch({ type: 'REQUEST_LOGIN' })
  fetch('http://localhost:3000/api/v1/auth/sign_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'email': username,
      'password': password
    })
  })
  .then(response => {
    if(response.status === 200) return response.json()
    return Promise.reject(new Error ('Unauthorized'))
  })
  .then(response => dispatch(userLoggedIn({ username, password, response })))
  .catch(() => dispatch(userLoggedInFailure()))
}

export const userLoggedIn = (user) => {
  db.initialize('dbname', user.password)
  return { type: 'USER_LOGGED_IN', user }
}

export const userLoggedInFailure = () => ({ type: 'USER_LOGGED_IN_FAILURE' })

export const userLoggedOut = (user) => {
  // TODO: Decide what to do with the old database
  ({ type: 'USER_LOGGED_OUT', user })
}

export {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  REQUEST_LOGIN,
  USER_LOGGED_IN_FAILURE
};
