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

const RequisitionsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.REQUISITION_GET_ALL:
    {
      // Get all Requisitions
      return DataManager.getAll(dispatch, action, '/requisitions', DataManager.db_requisitions, 'requisitions')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || []  })));
    }

    case ACTION_TYPES.REQUISITION_NEW:
    {
      const new_requisition = Object.assign(action.payload, {object_number: getState().requisitions.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_requisitions, new_requisition, '/requisition', 'requisitions')
      .then(response =>
      {
        const complete_requisition = Object.assign(action.payload, {_id: response});
        next({ type: ACTION_TYPES.REQUISITION_NEW, payload: complete_requisition });
        
        if(action.callback)
          action.callback(complete_requisition);
      });
    }
    
    case ACTION_TYPES.REQUISITION_UPDATE:
    {
      console.log('requisition update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_requisitions, action.payload, '/requisition', 'requisitions')
                        .then(response => next({ type: ACTION_TYPES.REQUISITION_UPDATE, payload: response }));
    }

    case ACTION_TYPES.REQUISITION_SAVE:
    {
      // Save doc to db
      // return saveDoc('requisitions', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.REQUISITION_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:requisition:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-requisition', action.payload);
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

    case ACTION_TYPES.REQUISITION_EDIT:
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

    case ACTION_TYPES.REQUISITION_DELETE:
    {
      // return deleteDoc('requisitions', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.REQUISITION_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:requisition:deleted'),
      //       },
      //     });
      //     // Clear form if this requisition is being editted
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

    case ACTION_TYPES.REQUISITION_DUPLICATE:
    {
      const duplicateRequisition = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.REQUISITION_SAVE,
        payload: duplicateRequisition,
      });
    }

    case ACTION_TYPES.REQUISITION_CONFIGS_SAVE:
    {
      // const { requisitionID, configs } = action.payload;
      // return getSingleDoc('requisitions', requisitionID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.REQUISITION_UPDATE,
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

    case ACTION_TYPES.REQUISITION_SET_STATUS:
    {
      // const { requisitionID, status } = action.payload;
      // return getSingleDoc('requisitions', requisitionID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.REQUISITION_UPDATE,
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

export default RequisitionsMW;
