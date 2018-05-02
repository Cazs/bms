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

const LeaveApplicationsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.LEAVE_GET_ALL:
    {
      // Get all LeaveApplications
      return DataManager.getAll(dispatch, action, '/leave_applications', DataManager.db_leave_applications, 'leave_applications')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }

    case ACTION_TYPES.LEAVE_NEW:
    {
      const new_leave_app = Object.assign(action.payload, {object_number: getState().leaveApplications.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_leave_applications, new_leave_app, '/leave_application', 'leave_applications')
                        .then(response => 
                          next({ type: ACTION_TYPES.LEAVE_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.LEAVE_UPDATE:
    {
      console.log('leave update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_leave_applications, action.payload, '/leave_application', 'leave_applications')
                        .then(response => next({ type: ACTION_TYPES.LEAVE_UPDATE, payload: response }));
    }

    case ACTION_TYPES.LEAVE_SAVE:
    {
      // Save doc to db
      // return saveDoc('leaveApplications', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.LEAVE_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:leaveApplication:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-leaveApplication', action.payload);
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

    case ACTION_TYPES.LEAVE_EDIT: {
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

    case ACTION_TYPES.LEAVE_DELETE: {
      // return deleteDoc('leaveApplications', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.LEAVE_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:leaveApplication:deleted'),
      //       },
      //     });
      //     // Clear form if this leaveApplication is being editted
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

    case ACTION_TYPES.LEAVE_DUPLICATE:
    {
      // const duplicateLeaveApplication = Object.assign({}, action.payload, {
      //   created_at: Date.now(),
      //   _id: uuidv4(),
      //   _rev: null,
      // })
      // return dispatch({
      //   type: ACTION_TYPES.LEAVE_SAVE,
      //   payload: duplicateLeaveApplication,
      // });
    }

    case ACTION_TYPES.LEAVE_UPDATE:
    {
      // return updateDoc('leaveApplications', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.LEAVE_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:leaveApplication:updated'),
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

    case ACTION_TYPES.LEAVE_CONFIGS_SAVE:
    {
      // const { leaveApplicationID, configs } = action.payload;
      // return getSingleDoc('leaveApplications', leaveApplicationID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.LEAVE_UPDATE,
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

    case ACTION_TYPES.LEAVE_SET_STATUS:
    {
      // const { leaveApplicationID, status } = action.payload;
      // return getSingleDoc('leaveApplications', leaveApplicationID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.LEAVE_UPDATE,
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

export default LeaveApplicationsMW;
