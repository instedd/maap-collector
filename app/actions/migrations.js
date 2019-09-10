import migrate from '../db/migrate';

const MIGRATIONS_RAN = 'MIGRATIONS_RAN';

export const migrationsRan = () => async dispatch => {
  await dispatch({ type: MIGRATIONS_RAN });
};

export const runMigrations = () => async (dispatch, getState) => {
  await migrate(getState().user);
  dispatch(migrationsRan());
};

export { MIGRATIONS_RAN };
