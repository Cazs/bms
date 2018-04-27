import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getEmployees = createAction(ACTION_TYPES.EMPLOYEE_GET_ALL);

export const saveEmployee = createAction(
  ACTION_TYPES.EMPLOYEE_SAVE,
  employeeData => employeeData
);

export const duplicateEmployee = createAction(
  ACTION_TYPES.EMPLOYEE_DUPLICATE,
  (employeeData) => employeeData
);

export const deleteEmployee = createAction(
  ACTION_TYPES.EMPLOYEE_DELETE,
  employeeID => employeeID
);

export const editEmployee = createAction(
  ACTION_TYPES.EMPLOYEE_EDIT,
  employeeData => employeeData
);

export const updateEmployee = createAction(
  ACTION_TYPES.EMPLOYEE_UPDATE,
  updatedEmployee => updatedEmployee
);

export const setEmployeeStatus = createAction(
  ACTION_TYPES.EMPLOYEE_SET_STATUS,
  (employeeID, status) => ({ employeeID, status })
);

export const saveEmployeeConfigs = createAction(
  ACTION_TYPES.EMPLOYEE_CONFIGS_SAVE,
  (employeeID, configs) => ({ employeeID, configs })
);
