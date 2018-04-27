import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/compliance/safety';

const SafetyDocumentsReducer = handleActions(
  {
    [combineActions(
      Actions.getSafetyDocuments,
      Actions.saveSafetyDocument,
      Actions.saveSafetyDocumentConfigs,
      Actions.updateSafetyDocument,
      Actions.deleteSafetyDocument,
      Actions.setSafetyDocumentStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default SafetyDocumentsReducer;

// Selector
const getSafetyDocumentsState = (state) => state.safetyDocuments;

export const getSafetyDocuments = createSelector(
  getSafetyDocumentsState,
  safetyDocuments => safetyDocuments
);
