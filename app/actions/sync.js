import { syncLabs } from './labs';
import { syncSpecimenSources } from './specimenSources';
import { syncCultureTypes } from './cultureTypes';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';

export const entities = [
  {
    name: 'SpecimenSource',
    listAction: syncSpecimenSources
  },
  {
    name: 'CultureType',
    listAction: syncCultureTypes
  },
  {
    name: 'Lab',
    listAction: syncLabs
  }
];

export const syncStart = () => dispatch => {
  dispatch({ type: SYNC_START });
  entities.forEach(({ listAction }) => {
    dispatch(listAction());
  });
  dispatch(syncSpecimenSources());
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export { SYNC_START, SYNC_STOP };
