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
                          next(Object.assign({}, action, { payload: docs || []  })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.REQUISITION_GET_ALL, payload: []}));
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
      })
      .catch(err =>
        next({ type: ACTION_TYPES.REQUISITION_NEW, payload: []}));
    }
    
    case ACTION_TYPES.REQUISITION_UPDATE:
    {
      console.log('requisition update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_requisitions, action.payload, '/requisition', 'requisitions')
                        .then(response =>
                          next({ type: ACTION_TYPES.REQUISITION_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.REQUISITION_UPDATE, payload: []}));
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

    default: {
      return next(action);
    }
  }
};

export default RequisitionsMW;
