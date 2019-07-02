import { syncLabs } from './labs';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';

export const entities = [
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
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export { SYNC_START, SYNC_STOP };
