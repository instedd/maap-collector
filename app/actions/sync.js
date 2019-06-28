import { syncLabs } from './labs';

const SYNC_START = 'SYNC_START';

export const entities = [
  {
    name: 'Lab',
    listAction: syncLabs
  }
];

export const syncStart = () => dispatch => {
  dispatch({ type: 'SYNC_START' });
  entities.forEach(({ listAction }) => {
    dispatch(listAction());
  });
};

export { SYNC_START };
