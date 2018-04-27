import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/hr/employees';

const EmployeesReducer = handleActions(
  {
    [combineActions(
      Actions.getEmployees,
      Actions.saveEmployee,
      Actions.saveEmployeeConfigs,
      Actions.updateEmployee,
      Actions.deleteEmployee,
      Actions.setEmployeeStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default EmployeesReducer;

// Selector
const getEmployeesState = (state) => state.employees;

export const getEmployees = createSelector(
  getEmployeesState,
  employees => employees
);
