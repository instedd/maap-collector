import qs from 'qs';
import { constantCase } from 'change-case';
import pluralize from 'pluralize';
import db from '../db';

const fetchEntity = (entityName, actions) => (
  where = {},
  order = [['id', 'desc']],
  startInLastPage = false,
  perPage = 20
) => async (dispatch, getState) => {
  const pluralizedEntityName = constantCase(pluralize(entityName));

  const actualActions = actions || {
    fetchAction: `FETCH_${pluralizedEntityName}`,
    fetchSucceededAction: `FETCHED_${pluralizedEntityName}`,
    fetchFailedAction: `FETCH_${pluralizedEntityName}_FAILED`
  };

  dispatch({ type: actualActions.fetchAction, where });

  const { user, router } = getState();
  const entity = (await db.initializeForUser(user))[entityName];
  const totalCount = await entity.count({ where });
  const totalPages = Math.ceil(totalCount / perPage);
  const currentPage =
    parseInt(qs.parse(router.location.search.slice(1)).page, 10) ||
    (startInLastPage ? totalPages : 1);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const offset = (currentPage - 1) * perPage;
  entity
    .findAll({ where, offset, limit: perPage, order })
    .then(items =>
      dispatch({
        type: actualActions.fetchSucceededAction,
        items,
        totalCount,
        totalPages,
        nextPage,
        prevPage,
        offset,
        limit: perPage
      })
    )
    .catch(error => dispatch({ type: actualActions.fetchFailedAction, error }));
};

const fetchEntitySingular = entityName => (where = {}) => async (
  dispatch,
  getState
) => {
  const singularizedEntityName = constantCase(pluralize.singular(entityName));
  dispatch({ type: `FETCH_${singularizedEntityName}`, where });
  const { user } = getState();
  const entity = (await db.initializeForUser(user))[entityName];
  entity
    .findOne({ where, order: [['id', 'desc']] })
    .then(item =>
      dispatch({
        type: `FETCHED_${singularizedEntityName}`,
        item: item.dataValues
      })
    )
    .catch(error =>
      dispatch({ type: `FETCH_${singularizedEntityName}_FAILED`, error })
    );
};

// eslint-disable-next-line
export { fetchEntity, fetchEntitySingular };
