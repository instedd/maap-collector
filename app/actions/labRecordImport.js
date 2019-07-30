const SET_FILE_DATA = 'SET_FILE_DATA';
const SET_PHI_DATA = 'SET_PHI_DATA';
const SET_PATIENT_ID_DATA = 'SET_PATIENT_ID';

export const setFileData = data => ({ type: SET_FILE_DATA, data });
export const setPhiData = data => ({ type: SET_PHI_DATA, data });
export const setPatientIdData = data => ({ type: SET_PATIENT_ID_DATA, data });

export { SET_FILE_DATA, SET_PHI_DATA, SET_PATIENT_ID_DATA };
