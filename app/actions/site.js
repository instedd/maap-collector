import db from '../db';

const SITE_CREATE = 'SITE_CREATE';
const SITE_CREATED = 'SITE_CREATED';
const SITE_ENTER = 'SITE_ENTER';
const SITE_EXIT = 'SITE_EXIT';

export const siteCreate = fields => async (dispatch, getState) => {
  const { user } = getState();
  const { Site } = await db.initializeForUser(user);
  dispatch({ type: SITE_CREATE, fields });

  await Site.create(fields);

  dispatch({ type: SITE_CREATED, fields });
};

export const enterSite = site => dispatch => {
  dispatch({ type: SITE_ENTER, site });
};

export const exitSite = () => dispatch => {
  dispatch({ type: SITE_EXIT });
};

export { SITE_CREATE, SITE_CREATED, SITE_ENTER, SITE_EXIT };
