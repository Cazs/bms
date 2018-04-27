import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/hr/leave_applications';

const LeaveApplicationsReducer = handleActions(
  {
    [combineActions(
      Actions.getLeaveApplications,
      Actions.saveLeave,
      Actions.saveLeaveConfigs,
      Actions.updateLeave,
      Actions.deleteLeave,
      Actions.setLeaveStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default LeaveApplicationsReducer;

// Selector
const getLeaveApplicationsState = (state) => state.leaveApplications;

export const getLeaveApplications = createSelector(
  getLeaveApplicationsState,
  leaveApplications => leaveApplications
);
