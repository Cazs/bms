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

const SuppliersMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.SUPPLIER_GET_ALL:
    {
      // Get all Suppliers
      return DataManager.getAll(dispatch, action, '/suppliers', DataManager.db_suppliers, 'suppliers')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }

    case ACTION_TYPES.SUPPLIER_NEW:
    {
      const new_supplier = Object.assign(action.payload, {object_number: getState().suppliers.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_suppliers, new_supplier, '/supplier', 'suppliers')
                        .then(response => 
                            next({ type: ACTION_TYPES.SUPPLIER_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.SUPPLIER_UPDATE:
    {
      console.log('supplier update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_suppliers, action.payload, '/supplier', 'suppliers')
                        .then(response => next({ type: ACTION_TYPES.SUPPLIER_UPDATE, payload: response }));
    }

    case ACTION_TYPES.SUPPLIER_SAVE:
    {
      // Save doc to db
      // return saveDoc('suppliers', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.SUPPLIER_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:supplier:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-supplier', action.payload);
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

    case ACTION_TYPES.SUPPLIER_EDIT:
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

    case ACTION_TYPES.SUPPLIER_DELETE:
    {
      // return deleteDoc('suppliers', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.SUPPLIER_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:supplier:deleted'),
      //       },
      //     });
      //     // Clear form if this supplier is being editted
      //     const { editMode } = getState().form.settings;
      //     if (editMode.active)
      //     {
      //       if (editMode.data._id === action.payload)
      //       {
      //         dispatch({ type: ACTION_TYPES.FORM_CLEAR });
      //       }
      //     }
      //   })
      //   .catch(err =>
      //   {
      //     next(
      //     {
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload:
      //       {
      //         type: 'warning',
      //         message: err.message,
      //       }
      //     });
      //   });
    }

    case ACTION_TYPES.SUPPLIER_DUPLICATE:
    {
      const duplicateSupplier = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.SUPPLIER_SAVE,
        payload: duplicateSupplier,
      });
    }

    case ACTION_TYPES.SUPPLIER_UPDATE:
    {
      // return updateDoc('suppliers', action.payload)
      //   .then(docs => {
      //     next({
      //       type: ACTION_TYPES.SUPPLIER_UPDATE,
      //       payload: docs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:supplier:updated'),
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

    case ACTION_TYPES.SUPPLIER_CONFIGS_SAVE:
    {
      // const { supplierID, configs } = action.payload;
      // return getSingleDoc('suppliers', supplierID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.SUPPLIER_UPDATE,
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

    case ACTION_TYPES.SUPPLIER_SET_STATUS:
    {
      // const { supplierID, status } = action.payload;
      // return getSingleDoc('suppliers', supplierID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.SUPPLIER_UPDATE,
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

export default SuppliersMW;
