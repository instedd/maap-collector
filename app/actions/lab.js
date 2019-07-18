import db from '../db';

const LAB_CREATE = 'LAB_CREATE';
const LAB_CREATED = 'LAB_CREATED';

export const labCreate = fields => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = await db.initializeForUser(user);
  dispatch({ type: LAB_CREATE, fields });

  await Lab.create(fields);

  dispatch({ type: LAB_CREATED, fields });
};

export { LAB_CREATE, LAB_CREATED };
