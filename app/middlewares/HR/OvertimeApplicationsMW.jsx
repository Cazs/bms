// Node Libs
import uuidv4 from 'uuid/v4';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import * as DataManager from '../../helpers/DataManager';

const OvertimeApplicationsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.OVERTIME_GET_ALL:
    {
      // Get all OvertimeApplications
      return DataManager.getAll(dispatch, action, '/overtime_applications', DataManager.db_overtime_applications, 'overtime_applications')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }

    case ACTION_TYPES.OVERTIME_NEW:
    {
      const new_overtime_app = Object.assign(action.payload, {object_number: getState().overtimeApplications.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_overtime_applications, new_overtime_app, '/overtime_application', 'overtime_applications')
                        .then(response => 
                          next({ type: ACTION_TYPES.OVERTIME_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.OVERTIME_UPDATE:
    {
      console.log('overtime update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_overtime_applications, action.payload, '/overtime_application', 'overtime_applications')
                        .then(response => next({ type: ACTION_TYPES.OVERTIME_UPDATE, payload: response }));
    }
    
    case ACTION_TYPES.OVERTIME_SAVE:
    {
      // Save doc to db
      // return saveDoc('overtimeApplications', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.OVERTIME_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:overtimeApplication:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-overtimeApplication', action.payload);
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

    case ACTION_TYPES.OVERTIME_EDIT: {
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

    case ACTION_TYPES.OVERTIME_DELETE: {
      // return deleteDoc('overtimeApplications', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.OVERTIME_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:overtimeApplication:deleted'),
      //       },
      //     });
      //     // Clear form if this overtimeApplication is being editted
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

    case ACTION_TYPES.OVERTIME_DUPLICATE:
    {
      // const duplicateOvertimeApplication = Object.assign({}, action.payload, {
      //   created_at: Date.now(),
      //   _id: uuidv4(),
      //   _rev: null,
      // })
      // return dispatch({
      //   type: ACTION_TYPES.OVERTIME_SAVE,
      //   payload: duplicateOvertimeApplication,
      // });
    }

    case ACTION_TYPES.OVERTIME_UPDATE:
    {
      // return updateDoc('overtimeApplications', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.OVERTIME_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:overtimeApplication:updated'),
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

    case ACTION_TYPES.OVERTIME_CONFIGS_SAVE:
    {
      // const { overtimeApplicationID, configs } = action.payload;
      // return getSingleDoc('overtimeApplications', overtimeApplicationID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.OVERTIME_UPDATE,
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

    case ACTION_TYPES.OVERTIME_SET_STATUS:
    {
      // const { overtimeApplicationID, status } = action.payload;
      // return getSingleDoc('overtimeApplications', overtimeApplicationID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.OVERTIME_UPDATE,
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

    default:{
      return next(action);
    }
  }
};

export default OvertimeApplicationsMW;
