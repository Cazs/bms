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

const SafetyMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.SAFETY_DOC_NEW:
    {
      console.log('safety doc add:', action.payload);
      return DataManager.putRemoteResource(dispatch, DataManager.db_safety_documents, action.payload, '/document/safety', 'safety_documents')
                        .then(response =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }
    
    case ACTION_TYPES.SAFETY_DOC_GET_ALL:
    {
      // Get safety documents
      return DataManager.getAll(dispatch, action, '/documents/safety', DataManager.db_safety_documents, 'safety_documents')
                        .then(docs => next({ type: ACTION_TYPES.SAFETY_DOC_GET_ALL, payload: docs }));
    }


    case ACTION_TYPES.SAFETY_DOC_UPDATE:
    {
      console.log('safety document update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_safety_documents, action.payload, '/document/safety', 'safety_documents')
                        .then(response => next({ type: ACTION_TYPES.SAFETY_DOC_UPDATE, payload: response }));
    }

    case ACTION_TYPES.SAFETY_DOC_DELETE:
    {
      // return deleteDoc('users', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.SAFETY_DOC_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:user:deleted'),
      //       },
      //     });
      //     // Clear form if this user is being editted
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

    case ACTION_TYPES.SAFETY_DOC_DUPLICATE:
    {
      const duplicateUser = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null
      });
      return dispatch(
      {
        type: ACTION_TYPES.SAFETY_DOC_SAVE,
        payload: duplicateUser
      });
    }
    
    case ACTION_TYPES.SAFETY_DOC_SET_STATUS:
    {
      // const { userID, status } = action.payload;
      // return getSingleDoc('users', userID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.SAFETY_DOC_UPDATE,
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

export default SafetyMW;
