import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getLeaveApplications = createAction(ACTION_TYPES.LEAVE_GET_ALL);

export const saveLeave = createAction(
  ACTION_TYPES.LEAVE_SAVE,
  leaveData => leaveData
);

export const duplicateLeave = createAction(
  ACTION_TYPES.LEAVE_DUPLICATE,
  (leaveData) => leaveData
);

export const deleteLeave = createAction(
  ACTION_TYPES.LEAVE_DELETE,
  leaveID => leaveID
);

export const editLeave = createAction(
  ACTION_TYPES.LEAVE_EDIT,
  leaveData => leaveData
);

export const updateLeave = createAction(
  ACTION_TYPES.LEAVE_UPDATE,
  updatedLeave => updatedLeave
);

export const setLeaveStatus = createAction(
  ACTION_TYPES.LEAVE_SET_STATUS,
  (leaveID, status) => ({ leaveID, status })
);

export const saveLeaveConfigs = createAction(
  ACTION_TYPES.LEAVE_CONFIGS_SAVE,
  (leaveID, configs) => ({ leaveID, configs })
);
