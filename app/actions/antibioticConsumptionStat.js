import db from '../db';

import { fetchAntibioticConsumptionStats } from './antibioticConsumptionStats';

const SAVING_ANTIBIOTIC_CONSUMPTION_STAT = 'SAVING_ANTIBIOTIC_CONSUMPTION_STAT';
const SAVED_ANTIBIOTIC_CONSUMPTION_STAT = 'SAVED_ANTIBIOTIC_CONSUMPTION_STAT';

export const createAntibioticConsumptionStat = attributes => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const { AntibioticConsumptionStat } = await db.initializeForUser(user);
  dispatch({ type: SAVING_ANTIBIOTIC_CONSUMPTION_STAT });

  const record = await AntibioticConsumptionStat.create(attributes);

  dispatch({ type: SAVED_ANTIBIOTIC_CONSUMPTION_STAT, record });
  dispatch(fetchAntibioticConsumptionStats(attributes.antibioticId));
};

export {
  SAVING_ANTIBIOTIC_CONSUMPTION_STAT,
  SAVED_ANTIBIOTIC_CONSUMPTION_STAT
};
