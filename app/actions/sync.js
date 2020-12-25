import snakeCaseKeys from 'snakecase-keys';
import moment from 'moment';

import db from '../db';
import { fetchPaginated, fetchAuthenticated } from '../utils/fetch';

import { syncSites } from './sites';
import { syncAntibioticConsumptionStats } from './antibioticConsumptionStats';
import { syncAntibiotics } from './antibiotics';
import { syncLabRecords } from './labRecords';
import { syncPatients } from './patients';
import { syncPatientEntries } from './patientEntries';
import { syncEntities } from './enums';
import { requestLogin } from './user';
import { isLoggedIn } from '../reducers/user';
import { syncElectronicPharmacyStockRecords } from './electronicPharmacyStockRecords';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';
const SYNC_FINISH = 'SYNC_FINISH';

// TODO: We should honor this order, currently the async process randomizes everything
export const entities = [
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
  },
  {
    name: 'ElectronicPharmacyStockRecord',
    syncAction: syncElectronicPharmacyStockRecords
  }
];

export const syncStart = () => async (dispatch, getState) => {
  const { sync, network, migrations, user } = getState();
  if (
    sync.synchronizing ||
    !network.online ||
    !migrations.ran ||
    !isLoggedIn(user)
  )
    return;

  dispatch({ type: SYNC_START });
  await dispatch(auth());
  setTimeout(
    async () =>
      // This way we ensure that the sync actions are runned in sequence instead of parallel
      entities
        .map(({ syncAction }) => syncAction)
        .reduce(
          (acc, current) => acc.then(() => dispatch(current())),
          Promise.resolve()
        )
        .then(() => dispatch({ type: SYNC_FINISH }))
        .catch(err => {
          console.error(err);
          return dispatch({ type: SYNC_FINISH });
        }),
    300
  );
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export const auth = () => async (dispatch, getState) => {
  const { user, network } = getState();

  if (!network.online || user.auth['access-token']) return;

  return dispatch(requestLogin(user.data.userEmail, user.data.password));
};

export const remoteSync = (url, user, entityName, mapper) => async () => {
  const initializedDb = await db.initializeForUser(user);
  const entity = initializedDb[entityName];
  const newestEntity = await entity.findOne({
    where: initializedDb.sequelize.literal(
      "lastSyncAt IS NOT 'Invalid date' AND lastSyncAt is NOT NULL"
    ),
    order: [['lastSyncAt', 'DESC']]
  });
  const newestRemoteIdEntity = await entity.findOne({
    order: [['remoteId', 'DESC']]
  });
  const newestLastSyncAt =
    newestEntity && newestEntity.lastSyncAt
      ? moment(newestEntity.lastSyncAt).toISOString()
      : null;
  const newestRemoteId = newestRemoteIdEntity
    ? newestRemoteIdEntity.remoteId
    : null;
  return fetchPaginated(
    url,
    user.auth,
    {
      qs: {
        updated_at_gth: newestLastSyncAt,
        id_gth: newestRemoteId
      }
    },
    (res, { total_count: totalCount }) => {
      if (totalCount === 0) return;
      return Promise.all(
        res.map(async item => {
          const mapped = mapper(item);
          return [
            item,
            mapped,
            await entity.findOrBuild({ where: { remoteId: mapped.remoteId } })
          ];
        })
      )
        .then(items =>
          Promise.all(
            items.map(([item, mapped, [foundEntity]]) => {
              const remoteIsBeforeLocal = moment(item.updated_at)
                .local()
                .isBefore(
                  moment(foundEntity.updatedAt)
                    .local()
                    .toISOString()
                );
              if (remoteIsBeforeLocal && !foundEntity.isNewRecord) {
                return foundEntity.update(
                  {
                    lastSyncAt: moment(item.updated_at)
                      .local()
                      .toDate(),
                    updatedAt: foundEntity.updatedAt
                  },
                  { silent: true }
                );
              }

              return foundEntity.update(
                {
                  ...mapped,
                  lastSyncAt: moment(item.updated_at)
                    .local()
                    .toDate(),
                  updatedAt: moment(item.updated_at)
                    .local()
                    .toDate()
                },
                { silent: true }
              );
            })
          )
        )
        .catch(e => console.log(e));
    }
  );
};

export const remoteUpload = (
  url,
  user,
  entityName,
  mapper,
  withSoftDelete = false
) => async () => {
  const initializedDb = await db.initializeForUser(user);
  const { sequelize } = initializedDb;
  const entity = initializedDb[entityName];

  const newestEntity = await entity.findOne({
    where: initializedDb.sequelize.literal(
      "lastSyncAt IS NOT 'Invalid date' AND lastSyncAt is NOT NULL"
    ),
    order: [['lastSyncAt', 'DESC']]
  });

  const newestLastSyncAt =
    newestEntity && newestEntity.lastSyncAt
      ? moment(newestEntity.lastSyncAt).toISOString()
      : null;

  const query = withSoftDelete
    ? "(deletedAt is NULL OR deletedAt IS 'Invalid date') AND (remoteId is NULL OR remoteId = '')"
    : "remoteId is NULL OR remoteId = ''";
  const collectionToCreate = await entity.findAll({
    where: sequelize.literal(query)
  });

  if (collectionToCreate.length === 0) return;

  return Promise.all(
    collectionToCreate.map(async currentEntity => {
      const mapped = await Promise.resolve(mapper(currentEntity));
      return fetchAuthenticated(url, user.auth, {
        method: 'POST',
        body: snakeCaseKeys({ [entityName]: mapped })
      })
        .then(async res => {
          const existingEntity = await entity.findOne({
            where: { remoteId: res.id },
            order: [['id', 'asc']]
          });
          if (existingEntity && existingEntity.id !== currentEntity.id)
            existingEntity.destroy();
          // TODO: `updatedAt` is not being updated for some reason
          // thus triggering an extra innocuous `update`
          return currentEntity.update({
            remoteId: res.id,
            lastSyncAt: newestLastSyncAt || new Date(),
            updatedAt: newestLastSyncAt || new Date()
          });
        })
        .catch(e => console.log(e));
    })
  );
};

export const remoteUploadUpdate = (
  url,
  entityName,
  mapper,
  withSoftDelete = false
) => async (dispatch, getState) => {
  const { user } = getState();
  const initializedDb = await db.initializeForUser(user);
  const { sequelize } = initializedDb;
  const entity = initializedDb[entityName];
  const newestEntity = await entity.findOne({
    where: initializedDb.sequelize.literal(
      "lastSyncAt IS NOT 'Invalid date' AND lastSyncAt is NOT NULL"
    ),
    order: [['lastSyncAt', 'DESC']]
  });

  const newestLastSyncAt =
    newestEntity && newestEntity.lastSyncAt
      ? moment(newestEntity.lastSyncAt).toISOString()
      : null;

  const query = withSoftDelete
    ? "(deletedAt is NULL OR deletedAt IS 'Invalid date') AND (remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M:%S', updatedAt) > strftime('%Y-%m-%d %H:%M:%S', lastSyncAt))"
    : "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M:%S', updatedAt) > strftime('%Y-%m-%d %H:%M:%S', lastSyncAt)";
  const collectionToUpdate = await entity.findAll({
    where: sequelize.literal(query)
  });
  return Promise.all(
    collectionToUpdate.map(async currentEntity => {
      const mapped = await Promise.resolve(mapper(currentEntity));
      return fetchAuthenticated(url(currentEntity.remoteId), user.auth, {
        method: 'PUT',
        body: snakeCaseKeys({ [entityName]: mapped })
      })
        .then(item =>
          entity.update(
            {
              lastSyncAt:
                newestLastSyncAt ||
                moment(item.updated_at)
                  .local()
                  .toDate(),
              updatedAt:
                newestLastSyncAt ||
                moment(item.updated_at)
                  .local()
                  .toDate()
            },
            {
              where: {
                id: currentEntity.id
              },
              silent: true
            }
          )
        )
        .catch(e => console.log(e));
    })
  );
};

export { SYNC_START, SYNC_STOP, SYNC_FINISH };
