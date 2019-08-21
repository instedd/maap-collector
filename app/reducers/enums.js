import * as enumActions from '../actions/enums';

export default function enumReducer(entity) {
  const initialState = null;

  const fetchAction = enumActions.fetchAction(entity);
  const fetchedAction = enumActions.fetchedAction(entity);
  const failedAction = enumActions.fetchedFailedAction(entity);

  return function reducer(state = initialState, action: Action) {
    switch (action.type) {
      case fetchAction:
        return null;
      case fetchedAction:
        return action.items.map(i => i.dataValues);
      case failedAction:
        return null;
      default:
        return state;
    }
  };
}
