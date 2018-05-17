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
                        {
                          const doc = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.OVERTIME_NEW, payload: doc });
                          if(action.callback)
                            action.callback(doc);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_NEW, payload: []}));
    }
    
    case ACTION_TYPES.SAFETY_DOC_GET_ALL:
    {
      // Get safety documents
      return DataManager.getAll(dispatch, action, '/documents/safety', DataManager.db_safety_documents, 'safety_documents')
                        .then(docs =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_GET_ALL, payload: docs }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_GET_ALL, payload: []}));
    }


    case ACTION_TYPES.SAFETY_DOC_UPDATE:
    {
      console.log('safety document update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_safety_documents, action.payload, '/document/safety', 'safety_documents')
                        .then(response =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.SAFETY_DOC_UPDATE, payload: []}));
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

    default: {
      return next(action);
    }
  }
};

export default SafetyMW;
