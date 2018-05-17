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

const InvoicesMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.INVOICE_GET_ALL:
    {
      // Get all Invoices
      return DataManager.getAll(dispatch, action, '/invoices', DataManager.db_invoices, 'invoices')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || [] })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.INVOICE_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.INVOICE_NEW:
    {
      const new_invoice = Object.assign(action.payload, {object_number: getState().invoices.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_invoices, new_invoice, '/invoice', 'invoices')
                        .then(response =>
                          {
                            const invoice = Object.assign(action.payload, {_id: response}); // w/ _id
                            next({ type: ACTION_TYPES.INVOICE_NEW, payload: invoice });
                            if(action.callback)
                              action.callback(invoice);
                          })
                          .catch(err =>
                            next({ type: ACTION_TYPES.INVOICE_NEW, payload: []}));
    }

    case ACTION_TYPES.INVOICE_UPDATE:
    {
      console.log('invoice update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_invoices, action.payload, '/invoice', 'invoices')
                        .then(response =>
                          next({ type: ACTION_TYPES.INVOICE_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.INVOICE_UPDATE, payload: []}));
    }

    default: {
      return next(action);
    }
  }
};

export default InvoicesMW;
