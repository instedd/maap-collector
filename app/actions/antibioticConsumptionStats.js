import snakeCaseKeys from 'snakecase-keys';
import { omit } from 'lodash';
import Sequelize from 'sequelize';
import { remoteSync, remoteUpload, remoteUploadUpdate } from './sync';
import { fetchEntity } from './fetch';

const UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS =
  'UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS';
const SYNC_ANTIBIOTIC_CONSUMPTION_STATS = 'SYNC_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_FAILED =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_FAILED';
const ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST =
  'ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST';
const CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST =
  'CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST';

// TODO: Abstract this to a helper function
const mapper = attrs =>
  omit(
    {
      ...attrs,
      remoteId: attrs.id,
      remoteAntibioticId: attrs.antibiotic_id,
      recipientFacility: attrs.recipient_facility,
      recipientUnit: attrs.recipient_unit,
      deletedAt: attrs.deleted_at,
      antibioticId: null,
      remoteSiteId: attrs.site_id,
      siteId: null
    },
    ['id', 'createdAt', 'updatedAt']
  );

const uploadMapper = async props => ({
  ...snakeCaseKeys(props.dataValues),
  id: props.dataValues.remoteId,
  siteId: await props.getRemoteSiteId(),
  antibioticId: await props.getRemoteAntibioticId()
});

export const syncAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: SYNC_ANTIBIOTIC_CONSUMPTION_STATS });
  return dispatch(
    remoteSync(
      '/api/v1/antibiotic_consumption_stats',
      user,
      'AntibioticConsumptionStat',
      mapper
    )
  ).then(() => dispatch(uploadAntibioticConsumptionStats()));
};

export const uploadAntibioticConsumptionStats = () => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  dispatch({ type: UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS });
  await dispatch(
    remoteUpload(
      '/api/v1/antibiotic_consumption_stats',
      user,
      'AntibioticConsumptionStat',
      uploadMapper,
      true
    )
  );
  await dispatch(
    remoteUploadUpdate(
      id => `/api/v1/antibiotic_consumption_stats/${id}`,
      'AntibioticConsumptionStat',
      uploadMapper,
      true
    )
  );
};

export const fetchAntibioticConsumptionStatsList = (
  where = {},
  order = [['date', 'asc']],
  startInLastPage = true,
  perPage = 20
) =>
  fetchEntity('AntibioticConsumptionStat', {
    fetchAction: FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST,
    fetchSucceededAction: FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED,
    fetchFailedAction: FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_FAILED
  })({
    where: {
      ...where,
      [Sequelize.Op.or]: [{ deletedAt: null }, { deletedAt: 'Invalid date' }]
    },
    order,
    startInLastPage,
    perPage
  });

export const addCreatedAntibioticConsumptionStat = createdACS => dispatch =>
  dispatch({
    type: ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST,
    newEntry: createdACS
  });

export const cleanAntibioticConsumptionStatsList = () => dispatch =>
  dispatch({ type: CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST });

export {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST,
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_SUCCEEDED,
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_LIST_FAILED,
  ADD_CREATED_ANTIBIOTIC_CONSUMPTION_STAT_TO_LIST,
  CLEAN_ANTIBIOTIC_CONSUMPTION_STATS_LIST
};
