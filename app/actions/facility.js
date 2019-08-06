import db from '../db';

const FACILITY_CREATE = 'FACILITY_CREATE';
const FACILITY_CREATED = 'FACILITY_CREATED';
const ENTER_FACILITY = 'ENTER_FACILITY';
const EXIT_FACILITY = 'EXIT_FACILITY';

export const facilityCreate = fields => async (dispatch, getState) => {
  const { user } = getState();
  const { Lab } = await db.initializeForUser(user);
  dispatch({ type: FACILITY_CREATE, fields });

  await Lab.create(fields);

  dispatch({ type: FACILITY_CREATED, fields });
};

export const enterFacility = facility => dispatch => {
  dispatch({ type: ENTER_FACILITY, facility });
};

export const exitFacility = () => dispatch => {
  dispatch({ type: EXIT_FACILITY });
};

export { FACILITY_CREATE, FACILITY_CREATED, ENTER_FACILITY, EXIT_FACILITY };
