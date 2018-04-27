import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/hr/overtime_applications';

const OvertimeApplicationsReducer = handleActions(
  {
    [combineActions(
      Actions.getOvertimeApplications,
      Actions.saveOvertime,
      Actions.saveOvertimeConfigs,
      Actions.updateOvertime,
      Actions.deleteOvertime,
      Actions.setOvertimeStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default OvertimeApplicationsReducer;

// Selector
const getOvertimeApplicationsState = (state) => state.overtimeApplications;

export const getOvertimeApplications = createSelector(
  getOvertimeApplicationsState,
  overtimeApplications => overtimeApplications
);
