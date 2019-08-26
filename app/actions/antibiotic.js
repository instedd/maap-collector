// @flow

import type { Dispatch, State } from '../reducers/types';
import db from '../db';
import { createEntity } from './persistence';

const FETCHING_ANTIBIOTIC = 'FETCHING_ANTIBIOTIC';
const FETCHED_ANTIBIOTIC = 'FETCHED_ANTIBIOTIC';
const CREATED_ANTIBIOTIC = 'CREATED_ANTIBIOTIC';
const CREATING_ANTIBIOTIC = 'CREATING_ANTIBIOTIC';
const CREATING_ANTIBIOTIC_FAILED = 'CREATING_ANTIBIOTIC_FAILED';

export const createAntibiotic = createEntity('Antibiotic');
export const fetchAntibiotic = (antibioticId: string) => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  dispatch({ type: FETCHING_ANTIBIOTIC });
  const { user } = getState();
  const { Antibiotic } = await db.initializeForUser(user);

  const antibiotic = await Antibiotic.findOne({
    where: { remoteId: antibioticId }
  });
  dispatch({ type: FETCHED_ANTIBIOTIC, antibiotic });
};

export {
  FETCHED_ANTIBIOTIC,
  CREATED_ANTIBIOTIC,
  CREATING_ANTIBIOTIC,
  CREATING_ANTIBIOTIC_FAILED
};
