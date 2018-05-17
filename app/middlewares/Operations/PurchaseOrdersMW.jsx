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
import * as DataManager from '../../helpers/DataManager';

const PurchaseOrdersMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.PURCHASE_ORDER_GET_ALL:
    {
      // Get all Purchase Orders
      return DataManager.getAll(dispatch, action, '/purchaseorders', DataManager.db_purchase_orders, 'purchase_orders')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || [] })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_GET_ALL, payload: []}));
    }
    
    case ACTION_TYPES.PURCHASE_ORDER_NEW:
    {
      // const new_po = Object.assign(action.payload, {object_number: getState().purchaseOrders.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_purchase_orders, action.payload, '/purchaseorder', 'purchase_orders')
                        .then(response => 
                        {
                          const new_po = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.MATERIAL_NEW, payload: new_po });
                          if(action.callback)
                            action.callback(new_po);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_NEW, payload: []}));
    }
    
    case ACTION_TYPES.PURCHASE_ORDER_UPDATE:
    {
      console.log('purchase order update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_purchase_orders, action.payload, '/purchaseorder', 'purchase_orders')
                        .then(response =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_UPDATE, payload: []}));
    }
    
    case ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD:
    {
      console.log('po item add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/purchaseorder/resource', 'purchase order resources')
                        .then(response =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD, payload: []}));
    }

    case ACTION_TYPES.PURCHASE_ORDER_DUPLICATE:
    {
      const duplicatePurchaseOrder = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.PURCHASE_ORDER_SAVE,
        payload: duplicatePurchaseOrder,
      });
    }

    default: {
      return next(action);
    }
  }
};

export default PurchaseOrdersMW;
