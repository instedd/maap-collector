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
import { requestLogin } from './user';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';
const SYNC_FINISH = 'SYNC_FINISH';

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
  const { sync, network, migrations, user } = getState();
  if (sync.synchronizing || !network.online || !migrations.ran || !user.auth)
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
        .then(() => dispatch({ type: SYNC_FINISH })),
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
  ).then(({ greather_updated_at: greatherUpdatedAt }) => {
    if (!greatherUpdatedAt) return;
    entity.update(
      {
        lastSyncAt: moment(greatherUpdatedAt)
          .local()
          .toDate(),
        updatedAt: moment(greatherUpdatedAt)
          .local()
          .toDate()
      },
      {
        where: initializedDb.sequelize.literal(
          "remoteId is NOT NULL AND strftime('%Y-%m-%d %H:%M:%S', updatedAt) <= strftime('%Y-%m-%d %H:%M:%S', lastSyncAt)"
        ),
        silent: true
      }
    );
    return Promise.resolve();
  });
};

export const remoteUpload = (url, user, entityName, mapper) => async () => {
  const initializedDb = await db.initializeForUser(user);
  const { sequelize } = initializedDb;
  const entity = initializedDb[entityName];
  const collectionToCreate = await entity.findAll({
    where: sequelize.literal("remoteId is NULL OR remoteId = ''")
  });

  if (collectionToCreate.length === 0) return;

  collectionToCreate.forEach(async currentEntity => {
    const mapped = await Promise.resolve(mapper(currentEntity));
    fetchAuthenticated(url, user.auth, {
      method: 'POST',
      body: snakeCaseKeys({ [entityName]: mapped })
    })
      .then(res =>
        currentEntity.update({ remoteId: res.id, lastSyncAt: new Date() })
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
      .then(item =>
        entity.update(
          {
            lastSyncAt: moment(item.updated_at)
              .local()
              .toDate(),
            updatedAt: moment(item.updated_at)
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
  });
  return Promise.resolve();
};

export { SYNC_START, SYNC_STOP, SYNC_FINISH };
