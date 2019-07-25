const Store = require('electron-store');

const store = new Store();

export const loadState = () => {
  try {
    const serializedState = store.get('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    store.set('state', serializedState);
  } catch {
    // ignore write errors
  }
};
