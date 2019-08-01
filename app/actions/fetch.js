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
  dispatch({ type: `FETCH_${pluralizedEntityName}` });
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
    .findAll({ where, offset, limit: PER_PAGE })
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

// eslint-disable-next-line
export { fetchEntity };
