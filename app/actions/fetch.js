import qs from 'qs';
import { constantCase } from 'change-case';
import pluralize from 'pluralize';
import db from '../db';

const PER_PAGE = 10;

const fetchEntity = entityName => (where = {}) => async (
  dispatch,
  getState
) => {
  const pluralizedEntityName = constantCase(pluralize(entityName));
  dispatch({ type: `FETCH_${pluralizedEntityName}`, where });
  const { user, router } = getState();
  const currentPage =
    parseInt(qs.parse(router.location.search.slice(1)).page, 10) || 1;
  const entity = (await db.initializeForUser(user))[entityName];
  const offset = (currentPage - 1) * PER_PAGE;
  const totalCount = await entity.count({ where });
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  entity
    .findAll({ where, offset, limit: PER_PAGE, order: [['id', 'desc']] })
    .then(items =>
      dispatch({
        type: `FETCHED_${pluralizedEntityName}`,
        items,
        totalCount,
        totalPages,
        nextPage,
        prevPage,
        offset,
        limit: PER_PAGE
      })
    )
    .catch(error =>
      dispatch({ type: `FETCH_${pluralizedEntityName}_FAILED`, error })
    );
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
