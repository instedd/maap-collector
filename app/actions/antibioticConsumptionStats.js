import db from '../db';
import { remoteSync } from './sync';

// const UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS =
//   'UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS = 'FETCH_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCHED_ANTIBIOTIC_CONSUMPTION_STATS =
  'FETCHED_ANTIBIOTIC_CONSUMPTION_STATS';
const SYNC_ANTIBIOTIC_CONSUMPTION_STATS = 'SYNC_ANTIBIOTIC_CONSUMPTION_STATS';
const FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED =
  'FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED';

// TODO: Abstract this to a helper function
const mapper = props => ({
  ...props,
  remoteId: props.id,
  remoteAntibioticId: props.antibiotic_id,
  recipientFacility: props.recipient_facility,
  recipientUnit: props.recipient_unit,
  antibioticId: null
});

// const uploadMapper = props => ({
//   ...props,
//   id: props.remoteId
// });

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
  );
  // .then(() => dispatch(uploadAntibioticConsumptionStats()));
};

// export const uploadAntibioticConsumptionStats = () => async (
//   dispatch,
//   getState
// ) => {
//   const { user } = getState();
//   dispatch({ type: UPLOAD_ANTIBIOTIC_CONSUMPTION_STATS });
//   dispatch(
//     remoteUpload(
//       '/api/v1/antibiotic_consumption_stats',
//       user,
//       'AntibioticConsumptionStat',
//       uploadMapper
//     )
//   );
// };

export const fetchAntibioticConsumptionStats = antibioticId => async (
  dispatch,
  getState
) => {
  const { user } = getState();
  const { AntibioticConsumptionStat } = await db.initializeForUser(user);
  dispatch({ type: FETCH_ANTIBIOTIC_CONSUMPTION_STATS });
  const totalCount = await AntibioticConsumptionStat.count({
    where: { antibioticId }
  });
  AntibioticConsumptionStat.findAll({ where: { antibioticId } })
    .then(async items =>
      //
      // await Promise.all(
      //   items.map(item =>
      //     // TODO: Generate this dinamically from relations
      //     // item.getFacility().then(facility => {
      //     //   // eslint-disable-next-line
      //     //   item.facility = facility;
      //     //   return facility;
      //     // })
      //   )
      // );
      dispatch({
        type: FETCHED_ANTIBIOTIC_CONSUMPTION_STATS,
        items,
        totalCount
      })
    )
    .catch(error =>
      dispatch({ type: FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED, error })
    );
};

export {
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCHED_ANTIBIOTIC_CONSUMPTION_STATS,
  FETCH_ANTIBIOTIC_CONSUMPTION_STATS_FAILED
};
