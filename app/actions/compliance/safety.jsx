import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getSafetyDocuments = createAction(ACTION_TYPES.SAFETY_GET_ALL);

export const saveSafetyDocument = createAction(
  ACTION_TYPES.SAFETY_SAVE,
  userData => userData
);

export const duplicateSafetyDocument = createAction(
  ACTION_TYPES.SAFETY_DUPLICATE,
  (userData) => userData
);

export const deleteSafetyDocument = createAction(
  ACTION_TYPES.SAFETY_DELETE,
  userID => userID
);

export const editSafetyDocument = createAction(
  ACTION_TYPES.SAFETY_EDIT,
  userData => userData
);

export const updateSafetyDocument = createAction(
  ACTION_TYPES.SAFETY_UPDATE,
  updatedSafetyDocument => updatedSafetyDocument
);

export const setSafetyDocumentStatus = createAction(
  ACTION_TYPES.SAFETY_SET_STATUS,
  (userID, status) => ({ userID, status })
);

export const saveSafetyDocumentConfigs = createAction(
  ACTION_TYPES.SAFETY_CONFIGS_SAVE,
  (userID, configs) => ({ userID, configs })
);
