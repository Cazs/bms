import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/requisitions';

const RequisitionsReducer = handleActions(
  {
    [combineActions(
      Actions.getRequisitions,
      Actions.saveRequisition,
      Actions.saveRequisitionConfigs,
      Actions.updateRequisition,
      Actions.deleteRequisition,
      Actions.setRequisitionStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default RequisitionsReducer;

// Selector
const getRequisitionsState = (state) => state.requisitions;

export const getRequisitions = createSelector(
  getRequisitionsState,
  requisitions => requisitions
);
