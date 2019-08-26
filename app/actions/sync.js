import snakeCaseKeys from 'snakecase-keys';
import moment from 'moment';

import db from '../db';
import { fetchPaginated, fetchAuthenticated } from '../utils/fetch';

import { syncSites } from './sites';
import { syncSpecimenSources } from './specimenSources';
import { syncCultureTypes } from './cultureTypes';
import { syncAntibioticConsumptionStats } from './antibioticConsumptionStats';
import { syncAntibiotics } from './antibiotics';
import { syncLabRecords } from './labRecords';
import { syncPatients } from './patients';
import { syncPatientEntries } from './patientEntries';
import { syncEntities } from './enums';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';
const SYNC_FINISH = 'SYNC_FINISH';
const UPDATE_PENDING_COUNT = 'UPDATE_PENDING_COUNT';
const UPDATE_PENDING_UPLOAD_COUNT = 'UPDATE_PENDING_UPLOAD_COUNT';
const REDUCE_PENDING_COUNT = 'REDUCE_PENDING_COUNT';
const REDUCE_PENDING_UPLOAD_COUNT = 'REDUCE_PENDING_UPLOAD_COUNT';

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
    name: 'ClinicalService',
    syncAction: syncEntities('ClinicalService')
  },
  {
    name: 'PatientLocation',
    syncAction: syncEntities('PatientLocation')
  },
  {
    name: 'Site',
    syncAction: syncSites
  },
  {
    name: 'Antibiotic',
    syncAction: syncAntibiotics
  },
  {
    name: 'AntibioticConsumptionStat',
    syncAction: syncAntibioticConsumptionStats
  },
  {
    name: 'Patient',
    syncAction: syncPatients
  },
  {
    name: 'PatientEntry',
    syncAction: syncPatientEntries
  },
  {
    name: 'LabRecord',
    syncAction: syncLabRecords
  }
];

export const syncStart = () => async (dispatch, getState) => {
  const { sync } = getState();
  if (sync.synchronizing) return;

  dispatch({ type: SYNC_START });
  setTimeout(
    async () =>
      // This way we ensure that the sync actions are runned in sequence instead of parallel
      entities
        .map(({ syncAction }) => syncAction)
        .reduce(
          (acc, current) => acc.then(() => dispatch(current())),
          Promise.resolve()
        )
        .then(() => dispatch({ type: SYNC_FINISH })),
    300
  );
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export const remoteSync = (url, user, entityName, mapper) => async dispatch => {
  const initializedDb = await db.initializeForUser(user);
  const entity = initializedDb[entityName];
  const oldestEntity = await entity.findOne({
    where: initializedDb.sequelize.literal("lastSyncAt IS NOT 'Invalid date'"),
    order: [['lastSyncAt', 'ASC']]
  });
  const newestRemoteIdEntity = await entity.findOne({
    order: [['remoteId', 'DESC']]
  });
  const oldestDate =
    oldestEntity && oldestEntity.lastSyncAt
      ? moment(oldestEntity.lastSyncAt).toISOString()
      : null;
  const newestRemoteId = newestRemoteIdEntity
    ? newestRemoteIdEntity.remoteId
    : null;
  return fetchPaginated(
    url,
    user.auth,
    {
      qs: {
        updated_at_gth: oldestDate,
        id_gth: newestRemoteId
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
      Promise.all(
        res.map(async item => {
          const mapped = mapper(item);
          return [
            item,
            mapped,
            await entity.findOrBuild({ where: { remoteId: mapped.remoteId } })
          ];
          // TODO: Do queries only if changed
        })
      )
        .then(items =>
          items.map(([item, mapped, [foundEntity]]) => {
            const remoteIsBeforeLocal = moment(item.updated_at).isBefore(
              moment(foundEntity.updatedAt).toISOString()
            );
            if (remoteIsBeforeLocal && !foundEntity.isNewRecord) {
              return foundEntity
                .update({
                  lastSyncAt: moment(item.updated_at).toDate(),
                  updatedAt: foundEntity.updatedAt
                })
                .then(() =>
                  dispatch({ type: REDUCE_PENDING_COUNT, entity: entityName })
                );
            }

            return foundEntity
              .update({
                ...mapped,
                lastSyncAt: moment(item.updated_at).toDate()
              })
              .then(() =>
                dispatch({ type: REDUCE_PENDING_COUNT, entity: entityName })
              );
          })
        )
        .catch(e => console.log(e));
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
    where: sequelize.literal("remoteId is NULL OR remoteId = ''")
  });

  const collectionToUpdate = await entity.findAll({
    where: sequelize.literal(
      "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M', updatedAt) > strftime('%Y-%m-%d %H:%M', lastSyncAt)"
    )
  });
  if (collectionToCreate.length === 0) return;
  dispatch({
    type: UPDATE_PENDING_UPLOAD_COUNT,
    entity: entityName,
    count: collectionToCreate.length + collectionToUpdate.length
  });

  collectionToCreate.forEach(async currentEntity => {
    const mapped = await Promise.resolve(mapper(currentEntity));
    fetchAuthenticated(url, user.auth, {
      method: 'POST',
      body: snakeCaseKeys({ [entityName]: mapped })
    })
      .then(res =>
        currentEntity.update({ remoteId: res.id, lastSyncAt: new Date() })
      )
      .then(() =>
        dispatch({ type: REDUCE_PENDING_UPLOAD_COUNT, entity: entityName })
      )
      .catch(e => console.log(e));
  });
  return Promise.resolve();
};

export const remoteUploadUpdate = (url, entityName, mapper) => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const initializedDb = await db.initializeForUser(user);
  const { sequelize } = initializedDb;
  const entity = initializedDb[entityName];
  const collectionToUpdate = await entity.findAll({
    where: sequelize.literal(
      "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M:%S', updatedAt) > strftime('%Y-%m-%d %H:%M:%S', lastSyncAt)"
    )
  });

  collectionToUpdate.forEach(async currentEntity => {
    const mapped = await Promise.resolve(mapper(currentEntity));
    fetchAuthenticated(url(currentEntity.remoteId), user.auth, {
      method: 'PUT',
      body: snakeCaseKeys({ [entityName]: mapped })
    })
      .then(() => currentEntity.update({ lastSyncAt: new Date() }))
      .then(() =>
        dispatch({ type: REDUCE_PENDING_UPLOAD_COUNT, entity: 'LabRecord' })
      )
      .catch(e => console.log(e));
  });
  return Promise.resolve();
};

export {
  SYNC_START,
  SYNC_STOP,
  SYNC_FINISH,
  UPDATE_PENDING_COUNT,
  UPDATE_PENDING_UPLOAD_COUNT,
  REDUCE_PENDING_COUNT,
  REDUCE_PENDING_UPLOAD_COUNT
};
