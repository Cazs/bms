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
                        .then(docs => next({type: ACTION_TYPES.EMPLOYEE_GET_ALL, payload: docs }));
    }

    case ACTION_TYPES.EMPLOYEE_NEW:
    {
      const new_employee = Object.assign(action.payload, {object_number: getState().employees.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_employees, new_employee, '/employee', 'employees')
                        .then(response => 
                            next({ type: ACTION_TYPES.EMPLOYEE_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.EMPLOYEE_UPDATE:
    {
      console.log('employee update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_employees, action.payload, '/employee', 'employees')
                        .then(response => next({ type: ACTION_TYPES.EMPLOYEE_UPDATE, payload: response }));
    }

    case ACTION_TYPES.EMPLOYEE_SAVE:
    {
      // Save doc to db
      // return saveDoc('employees', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.EMPLOYEE_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:employee:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-employee', action.payload);
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
    }

    case ACTION_TYPES.EMPLOYEE_EDIT:
    {
      // Continue
      // return getAllDocs('contacts')
      //   .then(allDocs => {
      //     next(
      //       Object.assign({}, action, {
      //         payload: Object.assign({}, action.payload, {
      //           contacts: allDocs
      //         })
      //       })
      //     );
      //     // Change Tab to Form
      //     dispatch(UIActions.changeActiveTab('form'));
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
    }

    case ACTION_TYPES.EMPLOYEE_DELETE:
    {
      // return deleteDoc('employees', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.EMPLOYEE_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:employee:deleted'),
      //       },
      //     });
      //     // Clear form if this employee is being editted
      //     const { editMode } = getState().form.settings;
      //     if (editMode.active) {
      //       if (editMode.data._id === action.payload) {
      //         dispatch({ type: ACTION_TYPES.FORM_CLEAR });
      //       }
      //     }
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
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

    case ACTION_TYPES.EMPLOYEE_UPDATE:
    {
      // return updateDoc('employees', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.EMPLOYEE_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:employee:updated'),
      //       },
      //     });
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
    }

    case ACTION_TYPES.EMPLOYEE_CONFIGS_SAVE:
    {
      // const { employeeID, configs } = action.payload;
      // return getSingleDoc('employees', employeeID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.EMPLOYEE_UPDATE,
      //       payload: Object.assign({}, doc, {configs})
      //     })
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
    }

    case ACTION_TYPES.EMPLOYEE_SET_STATUS:
    {
      // const { employeeID, status } = action.payload;
      // return getSingleDoc('employees', employeeID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.EMPLOYEE_UPDATE,
      //       payload: Object.assign({}, doc, { status })
      //     })
      //   })
      //   .catch(err => {
      //     next({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'warning',
      //         message: err.message,
      //       },
      //     });
      //   });
    }

    default: {
      return next(action);
    }
  }
};

export default EmployeesMW;
