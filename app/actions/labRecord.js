const UPDATING_LAB_RECORD = 'UPDATING_LAB_RECORD';
const UPDATED_LAB_RECORD = 'UPDATED_LAB_RECORD';

export const updateLabRecord = ({ rows }) => async (dispatch, getState) => {
  const { labRecords } = getState();
  const { labRecord } = labRecords;
  dispatch({ type: UPDATING_LAB_RECORD });
  await labRecord.update({
    rows
  });

  dispatch({ type: UPDATED_LAB_RECORD });
};

export default { UPDATED_LAB_RECORD, UPDATING_LAB_RECORD };
