const NETWORK_ONLINE = 'NETWORK_ONLINE';
const NETWORK_OFFLINE = 'NETWORK_OFFLINE';

export const setNetworkOnline = () => ({ type: 'NETWORK_ONLINE' });
export const setNetworkOffline = () => ({ type: 'NETWORK_OFFLINE' });

export { NETWORK_ONLINE, NETWORK_OFFLINE };
