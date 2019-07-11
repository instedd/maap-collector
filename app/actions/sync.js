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
  entities.forEach(({ listAction }) => {
    dispatch(listAction());
  });
};

export const syncStop = () => dispatch => {
  dispatch({ type: SYNC_STOP });
};

export const remoteSync = (url, user, entityName, mapper) => async dispatch => {
  const initializedDb = db.initializeForUser(user);
  const entity = initializedDb[entityName];
  return fetchPaginated(
    url,
    user.auth,
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
              return foundEntity.update(mapped);
            })
            .catch(e => console.log(e))
        );
      });
    }
  );
};

export { SYNC_START, SYNC_STOP, UPDATE_PENDING_COUNT, REDUCE_PENDING_COUNT };
