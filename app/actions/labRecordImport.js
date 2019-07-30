const SET_FILE_DATA = 'SET_FILE_DATA';
const SET_PHI_DATA = 'SET_PHI_DATA';

export const setFileData = data => ({ type: SET_FILE_DATA, data });
export const setPhiData = data => ({ type: SET_PHI_DATA, data });

export { SET_FILE_DATA, SET_PHI_DATA };
