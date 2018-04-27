import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getOvertimeApplications = createAction(ACTION_TYPES.OVERTIME_GET_ALL);

export const saveOvertime = createAction(
  ACTION_TYPES.OVERTIME_SAVE,
  overtimeData => overtimeData
);

export const duplicateOvertime = createAction(
  ACTION_TYPES.OVERTIME_DUPLICATE,
  (overtimeData) => overtimeData
);

export const deleteOvertime = createAction(
  ACTION_TYPES.OVERTIME_DELETE,
  overtimeID => overtimeID
);

export const editOvertime = createAction(
  ACTION_TYPES.OVERTIME_EDIT,
  overtimeData => overtimeData
);

export const updateOvertime = createAction(
  ACTION_TYPES.OVERTIME_UPDATE,
  updatedOvertime => updatedOvertime
);

export const setOvertimeStatus = createAction(
  ACTION_TYPES.OVERTIME_SET_STATUS,
  (overtimeID, status) => ({ overtimeID, status })
);

export const saveOvertimeConfigs = createAction(
  ACTION_TYPES.OVERTIME_CONFIGS_SAVE,
  (overtimeID, configs) => ({ overtimeID, configs })
);
