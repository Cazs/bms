// Node Libs
import uuidv4 from 'uuid/v4';
import currencies from '../../../libs/currencies.json';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import  * as DataManager from '../../helpers/DataManager';

const EmployeesMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.EMPLOYEE_GET_ALL:
    {
      // Get all Employees
      return DataManager.getAll(dispatch, action, '/employees', DataManager.db_employees, 'employees')
                        .then(docs =>
                          next({type: ACTION_TYPES.EMPLOYEE_GET_ALL, payload: docs }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.EMPLOYEE_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.EMPLOYEE_NEW:
    {
      const new_employee = Object.assign(action.payload, {object_number: getState().employees.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_employees, new_employee, '/employee', 'employees')
                        .then(response =>
                        {
                          const employee = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.EMPLOYEE_NEW, payload: employee });
                          if(action.callback)
                            action.callback(employee);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.EMPLOYEE_NEW, payload: []}));
    }

    case ACTION_TYPES.EMPLOYEE_UPDATE:
    {
      console.log('employee update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_employees, action.payload, '/employee', 'employees')
                        .then(response =>
                          next({ type: ACTION_TYPES.EMPLOYEE_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.EMPLOYEE_UPDATE, payload: []}));
    }

    case ACTION_TYPES.EMPLOYEE_DUPLICATE:
    {
      const duplicateEmployee = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.EMPLOYEE_SAVE,
        payload: duplicateEmployee,
      });
    }

    default: {
      return next(action);
    }
  }
};

export default EmployeesMW;
