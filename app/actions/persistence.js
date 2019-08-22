import { constantCase } from 'change-case';
import pluralize from 'pluralize';
import db from '../db';

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

// eslint-disable-next-line
export { updateEntity };
