// Node Libs
import uuidv4 from 'uuid/v4';
// import currencies from '../../../libs/currencies.json';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import * as DataManager from '../../helpers/DataManager';

const ClientsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.CLIENT_GET_ALL:
    {
      // Get all Clients from DB server
      return DataManager.getAll(dispatch, action, '/clients', DataManager.db_clients, 'clients')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }

    case ACTION_TYPES.CLIENT_SAVE:
    {
      // Save doc to db
      // return saveDoc('clients', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.CLIENT_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:client:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-client', action.payload);
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

    case ACTION_TYPES.CLIENT_EDIT:
    {
      // // Continue
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

    case ACTION_TYPES.CLIENT_DELETE:
    {
      // return deleteDoc('clients', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.CLIENT_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:client:deleted'),
      //       },
      //     });
      //     // Clear form if this client is being editted
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

    case ACTION_TYPES.CLIENT_DUPLICATE:
    {
      const duplicateClient = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      })
      return dispatch({
        type: ACTION_TYPES.CLIENT_SAVE,
        payload: duplicateClient,
      });
    }

    case ACTION_TYPES.CLIENT_UPDATE:
    {
      // return updateDoc('clients', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.CLIENT_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:client:updated'),
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

    case ACTION_TYPES.CLIENT_CONFIGS_SAVE:
    {
      // const { clientID, configs } = action.payload;
      // return getSingleDoc('clients', clientID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.CLIENT_UPDATE,
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

    case ACTION_TYPES.CLIENT_SET_STATUS:
    {
      // const { clientID, status } = action.payload;
      // return getSingleDoc('clients', clientID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.CLIENT_UPDATE,
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

export default ClientsMW;
