import db from '../db';

const SAVING_ANTIBIOTIC_CONSUMPTION_STAT = 'SAVING_ANTIBIOTIC_CONSUMPTION_STAT';
const SAVED_ANTIBIOTIC_CONSUMPTION_STAT = 'SAVED_ANTIBIOTIC_CONSUMPTION_STAT';

export const createAntibioticConsumptionStat = attributes => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const { AntibioticConsumptionStat } = db.initializeForUser(user);
  dispatch({ type: SAVING_ANTIBIOTIC_CONSUMPTION_STAT });

  const record = await AntibioticConsumptionStat.create(attributes);

  dispatch({ type: SAVED_ANTIBIOTIC_CONSUMPTION_STAT, record });
};

export {
  SAVING_ANTIBIOTIC_CONSUMPTION_STAT,
  SAVED_ANTIBIOTIC_CONSUMPTION_STAT
};
