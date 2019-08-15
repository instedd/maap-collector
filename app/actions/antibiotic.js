// @flow

import type { Dispatch, State } from '../reducers/types';
import db from '../db';

const FETCH_ANTIBIOTIC = 'FETCH_ANTIBIOTIC';
const FETCHED_ANTIBIOTIC = 'FETCHED_ANTIBIOTIC';

export const fetchAntibiotic = (antibioticId: string) => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  dispatch({ type: FETCH_ANTIBIOTIC });
  const { user } = getState();
  const { Antibiotic } = await db.initializeForUser(user);

  const antibiotic = await Antibiotic.findOne({
    where: { remoteId: antibioticId }
  });
  dispatch({ type: FETCHED_ANTIBIOTIC, antibiotic });
};

export { FETCHED_ANTIBIOTIC };
