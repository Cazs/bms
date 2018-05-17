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
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || [] })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.MATERIAL_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.MATERIAL_NEW:
    {
      const new_resource = Object.assign(action.payload, {object_number: getState().materials.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_materials, new_resource, '/resource', 'resources')
                        .then(response =>
                        {
                          const new_material = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.MATERIAL_NEW, payload: new_material });
                          if(action.callback)
                            action.callback(new_material);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.MATERIAL_NEW, payload: []}));
    }

    case ACTION_TYPES.MATERIAL_UPDATE:
    {
      console.log('resource update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_materials, action.payload, '/resource', 'resources')
                        .then(response =>
                          next({ type: ACTION_TYPES.MATERIAL_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.MATERIAL_UPDATE, payload: []}));
    }

    default: {
      return next(action);
    }
  }
};

export default ResourcesMW;
