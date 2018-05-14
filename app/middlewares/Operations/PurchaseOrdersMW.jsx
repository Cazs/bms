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
        next({ type: ACTION_TYPES.PURCHASE_ORDER_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }
    
    case ACTION_TYPES.PURCHASE_ORDER_UPDATE:
    {
      console.log('purchase order update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_purchase_orders, action.payload, '/purchaseorder', 'purchase_orders')
                        .then(response => next({ type: ACTION_TYPES.PURCHASE_ORDER_UPDATE, payload: response }));
    }
    
    case ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD:
    {
      console.log('po item add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/purchaseorder/resource', 'purchase order resources')
      .then(response => next({ type: ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD, payload: response }));
    }
      
      case ACTION_TYPES.PURCHASE_ORDER_SAVE:
      {
        // Save doc to db
        // return saveDoc('purchaseOrders', action.payload)
        //   .then(newDocs => {
          //     next({
            //       type: ACTION_TYPES.PURCHASE_ORDER_SAVE,
            //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:purchaseOrder:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-purchaseOrder', action.payload);
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

    case ACTION_TYPES.PURCHASE_ORDER_EDIT:
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
    
    case ACTION_TYPES.PURCHASE_ORDER_DELETE:
    {
      // return deleteDoc('purchaseOrders', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.PURCHASE_ORDER_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:purchaseOrder:deleted'),
      //       },
      //     });
      //     // Clear form if this purchaseOrder is being editted
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


    case ACTION_TYPES.PURCHASE_ORDER_CONFIGS_SAVE:
    {
      // const { purchaseOrderID, configs } = action.payload;
      // return getSingleDoc('purchaseOrders', purchaseOrderID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.PURCHASE_ORDER_UPDATE,
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

    case ACTION_TYPES.PURCHASE_ORDER_SET_STATUS:
    {
      // const { purchaseOrderID, status } = action.payload;
      // return getSingleDoc('purchaseOrders', purchaseOrderID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.PURCHASE_ORDER_UPDATE,
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

export default PurchaseOrdersMW;
