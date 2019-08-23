import { constantCase } from 'change-case';
import pluralize from 'pluralize';
import db from '../db';

const createEntity = (entityName: string) => attributes => async (
  dispatch,
  getState
) => {
  const singularizedEntityName = constantCase(pluralize.singular(entityName));
  dispatch({ type: `CREATING_${singularizedEntityName}` });
  const { user } = getState();
  const entity = (await db.initializeForUser(user))[entityName];

  return entity
    .create(attributes)
    .then(record =>
      dispatch({ type: `CREATED_${singularizedEntityName}`, record })
    )
    .catch(e => {
      dispatch({
        type: `CREATING_${singularizedEntityName}_FAILED`,
        errors: [...new Set(e.errors.map(({ message }) => message))]
      });
      throw e;
    });
};

const updateEntity = (entityName: string) => (id: number, attributes) => async (
  dispatch,
  getState
) => {
  const singularizedEntityName = constantCase(pluralize.singular(entityName));
  dispatch({ type: `UPDATING_${singularizedEntityName}`, id });
  const { user } = getState();
  const entity = (await db.initializeForUser(user))[entityName];
  const attributesToApply = { ...attributes };
  if (attributesToApply.lastSyncAt === '') attributesToApply.lastSyncAt = null;
  return entity
    .findOne({ where: { id } })
    .then(ent =>
      ent
        .update(attributesToApply)
        .then(record =>
          dispatch({ type: `UPDATED_${singularizedEntityName}`, record })
        )
    );
};

export { updateEntity, createEntity };
