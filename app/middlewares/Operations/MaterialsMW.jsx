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

const ResourcesMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.MATERIAL_GET_ALL:
    {
      // Get all Resources
      return DataManager.getAll(dispatch, action, '/resources', DataManager.db_materials, 'resources')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }

    case ACTION_TYPES.MATERIAL_NEW:
    {
      const new_resource = Object.assign(action.payload, {object_number: getState().materials.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_materials, new_resource, '/resource', 'resources')
                        .then(response => 
                            next({ type: ACTION_TYPES.MATERIAL_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.MATERIAL_UPDATE:
    {
      console.log('resource update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_materials, action.payload, '/resource', 'resources')
                        .then(response => next({ type: ACTION_TYPES.MATERIAL_UPDATE, payload: response }));
    }

    case ACTION_TYPES.MATERIAL_SAVE:
    {
      // Save doc to db
      // return saveDoc('resources', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.MATERIAL_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:resource:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-resource', action.payload);
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

    case ACTION_TYPES.MATERIAL_EDIT:
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

    case ACTION_TYPES.MATERIAL_DELETE:
    {
      // return deleteDoc('resources', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.MATERIAL_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:resource:deleted'),
      //       },
      //     });
      //     // Clear form if this resource is being editted
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

    case ACTION_TYPES.MATERIAL_DUPLICATE:
    {
      const duplicateResource = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      })
      return dispatch(
      {
        type: ACTION_TYPES.MATERIAL_SAVE,
        payload: duplicateResource,
      });
    }

    case ACTION_TYPES.MATERIAL_UPDATE:
    {
      // return updateDoc('resources', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.MATERIAL_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:resource:updated'),
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

    case ACTION_TYPES.MATERIAL_CONFIGS_SAVE:
    {
      // const { resourceID, configs } = action.payload;
      // return getSingleDoc('resources', resourceID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.MATERIAL_UPDATE,
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

    case ACTION_TYPES.MATERIAL_SET_STATUS:
    {
      // const { resourceID, status } = action.payload;
      // return getSingleDoc('resources', resourceID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.MATERIAL_UPDATE,
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

export default ResourcesMW;
