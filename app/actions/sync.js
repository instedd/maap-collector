import snakeCaseKeys from 'snakecase-keys';

import db from '../db';
import { fetchPaginated, fetchAuthenticated } from '../utils/fetch';

import { syncLabs } from './labs';
import { syncSpecimenSources } from './specimenSources';
import { syncCultureTypes } from './cultureTypes';
import { syncAntibioticConsumptionStats } from './antibioticConsumptionStats';
import { syncAntibiotics } from './antibiotics';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';
const UPDATE_PENDING_COUNT = 'UPDATE_PENDING_COUNT';
const UPDATE_PENDING_UPLOAD_COUNT = 'UPDATE_PENDING_UPLOAD_COUNT';
const REDUCE_PENDING_COUNT = 'REDUCE_PENDING_COUNT';
const REDUCE_PENDING_UPLOAD_COUNT = 'REDUCE_PENDING_COUNT';

// TODO: We should honor this order, currently the async process randomizes everything
export const entities = [
  {
    name: 'SpecimenSource',
    syncAction: syncSpecimenSources
  },
  {
    name: 'CultureType',
    syncAction: syncCultureTypes
  },
  {
    name: 'Lab',
    syncAction: syncLabs
  },
  {
    name: 'Antibiotic',
    syncAction: syncAntibiotics
  },
  {
    name: 'AntibioticConsumptionStat',
    syncAction: syncAntibioticConsumptionStats
  }
];

export const syncStart = () => async dispatch => {
  dispatch({ type: SYNC_START });
  setTimeout(async () => {
    // This way we ensure that the sync actions are runned in sequence instead of parallel
    entities
      .map(({ syncAction }) => syncAction)
      .reduce(
        (acc, current) => acc.then(() => dispatch(current())),
        Promise.resolve(0)
      );
  }, 300);
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export const remoteSync = (url, user, entityName, mapper) => async dispatch => {
  const initializedDb = await db.initializeForUser(user);
  const entity = initializedDb[entityName];
  const oldestEntity = await entity.findOne({
    order: [['lastSyncAt', 'DESC']]
  });
  const oldestDate = oldestEntity
    ? new Date(oldestEntity.lastSyncAt).toUTCString()
    : null;
  return fetchPaginated(
    url,
    user.auth,
    {
      qs: {
        updated_at_gth: oldestDate
      }
    },
    (res, { total_count: totalCount, current_page: currentPage }) => {
      if (totalCount === 0) return;
      if (currentPage === '1')
        dispatch({
          type: UPDATE_PENDING_COUNT,
          entity: entityName,
          count: totalCount
        });
      res.forEach(async item => {
        const mapped = mapper(item);
        return (
          entity
            .findOrBuild({ where: { id: mapped.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([foundEntity]) => {
              dispatch({ type: REDUCE_PENDING_COUNT, entity: entityName });
              return foundEntity.update({
                ...mapped,
                lastSyncAt: new Date()
              });
            })
            .catch(e => console.log(e))
        );
      });
    }
  );
};

export const remoteUpload = (
  url,
  user,
  entityName,
  mapper
) => async dispatch => {
  const initializedDb = await db.initializeForUser(user);
  const { sequelize } = initializedDb;
  const entity = initializedDb[entityName];
  const collectionToCreate = await entity.findAll({
    where: sequelize.literal('remoteId is NULL')
  });
  if (collectionToCreate.length === 0) return;
  dispatch({
    type: UPDATE_PENDING_UPLOAD_COUNT,
    entity: entityName,
    count: collectionToCreate.length
  });
  collectionToCreate.forEach(currentEntity => {
    fetchAuthenticated(url, user.auth, {
      method: 'POST',
      body: snakeCaseKeys({ [entityName]: mapper(currentEntity) })
    })
      .then(res => currentEntity.update({ remoteId: res.id }))
      .then(() =>
        dispatch({ type: REDUCE_PENDING_UPLOAD_COUNT, entity: entityName })
      )
      .catch(e => console.log(e));
  });

  // TODO: Implement update
  // const collectionToCreate = await entity.findAll({
  //   where: sequelize.literal('updatedAt > lastSyncAt')
  // })
};

export {
  SYNC_START,
  SYNC_STOP,
  UPDATE_PENDING_COUNT,
  UPDATE_PENDING_UPLOAD_COUNT,
  REDUCE_PENDING_COUNT,
  REDUCE_PENDING_UPLOAD_COUNT
};
