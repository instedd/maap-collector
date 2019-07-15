import db from '../db';
import { fetchPaginated } from '../utils/fetch';

import { syncLabs } from './labs';
import { syncSpecimenSources } from './specimenSources';
import { syncCultureTypes } from './cultureTypes';
import { syncAntibioticConsumptionStats } from './antibioticConsumptionStats';

const SYNC_START = 'SYNC_START';
const SYNC_STOP = 'SYNC_STOP';
const UPDATE_PENDING_COUNT = 'UPDATE_PENDING_COUNT';
const REDUCE_PENDING_COUNT = 'REDUCE_PENDING_COUNT';

export const entities = [
  {
    name: 'SpecimenSource',
    listAction: syncSpecimenSources
  },
  {
    name: 'CultureType',
    listAction: syncCultureTypes
  },
  {
    name: 'Lab',
    listAction: syncLabs
  },
  {
    name: 'AntibioticConsumptionStat',
    listAction: syncAntibioticConsumptionStats
  }
];

export const syncStart = () => dispatch => {
  dispatch({ type: SYNC_START });
  entities.forEach(({ listAction }, i) => {
    setTimeout(() => dispatch(listAction()), 300 * (i + 1));
  });
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export const remoteSync = (url, user, entityName, mapper) => async dispatch => {
  const initializedDb = await await db.initializeForUser(user);
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
      updated_at_gth: oldestDate
    },
    (res, { total_count: totalCount, current_page: currentPage }) => {
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
                mapped,
                lastSyncAt: new Date()
              });
            })
            .catch(e => console.log(e))
        );
      });
    }
  );
};

export { SYNC_START, SYNC_STOP, UPDATE_PENDING_COUNT, REDUCE_PENDING_COUNT };
