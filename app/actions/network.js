import { syncStart, syncStop } from './sync';

const NETWORK_ONLINE = 'NETWORK_ONLINE';
const NETWORK_OFFLINE = 'NETWORK_OFFLINE';

export const setNetworkOnline = () => async dispatch => {
  await dispatch({ type: NETWORK_ONLINE });
  dispatch(syncStart());
};
export const setNetworkOffline = () => dispatch => {
  // TODO: Implement stop
  dispatch(syncStop());
  dispatch({ type: NETWORK_OFFLINE });
};
export { NETWORK_ONLINE, NETWORK_OFFLINE };
