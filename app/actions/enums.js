import changeCase from 'change-case';
import pluralize from 'pluralize';
import { remoteSync } from './sync';
import { fetchEntity } from './fetch';

export const apiEntity = entity => `${pluralize(changeCase.snakeCase(entity))}`;

export const pluralizedEntityName = entity =>
  changeCase.constantCase(pluralize(entity));

export const fetchAction = entity => `FETCH_${pluralizedEntityName(entity)}`;

export const fetchedAction = entity =>
  `FETCHED_${pluralizedEntityName(entity)}`;

export const fetchedFailedAction = entity =>
  `FETCH_FAILED_${pluralizedEntityName(entity)}`;

export const syncAction = entity => `SYNC_${pluralizedEntityName(entity)}`;

const baseMapper = props => ({
  ...props,
  remoteId: props.id
});

export const syncEntities = entity => () => async (dispatch, getState) => {
  const { user } = getState();

  dispatch({ type: syncAction(entity) });
  return dispatch(
    remoteSync(`/api/v1/${apiEntity(entity)}`, user, entity, baseMapper)
  );
};

export const fetchEnum = entity => fetchEntity(entity);
