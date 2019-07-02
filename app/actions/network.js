import { syncStart, syncStop } from './sync';

const NETWORK_ONLINE = 'NETWORK_ONLINE';
const NETWORK_OFFLINE = 'NETWORK_OFFLINE';

export const setNetworkOnline = () => dispatch => {
  dispatch(syncStart());
  dispatch({ type: NETWORK_ONLINE });
};
export const setNetworkOffline = () => dispatch => {
  // TODO: Implement stop
  dispatch(syncStop());
  dispatch({ type: NETWORK_OFFLINE });
};
export { NETWORK_ONLINE, NETWORK_OFFLINE };
