import db from '../db';

const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export const userLoggedIn = (user = { id: 7, password: '123' }) => {
  db.initialize(user.id, user.password);
  return { type: 'USER_LOGGED_IN', user };
};

export const userLoggedOut = (user = { id: 7, password: '123' }) =>
  // TODO: Decide what to do with the old database
  ({ type: 'USER_LOGGED_OUT', user });

export { USER_LOGGED_IN, USER_LOGGED_OUT };
