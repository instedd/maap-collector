import * as enumActions from '../actions/enums';

export default function enumReducer(entity) {
  const initialState = {
    state: 'notLoaded',
    options: []
  };

  const fetchAction = enumActions.fetchAction(entity);
  const fetchedAction = enumActions.fetchedAction(entity);
  const failedAction = enumActions.fetchedFailedAction(entity);

  return function reducer(state = initialState, action: Action) {
    switch (action.type) {
      case fetchAction:
        return {
          state: 'loading',
          options: []
        };
      case fetchedAction:
        return {
          state: 'loaded',
          options: action.items.map(i => i.dataValues)
        };
      case failedAction:
        return {
          state: 'failed',
          options: []
        };
      default:
        return state;
    }
  };
}
