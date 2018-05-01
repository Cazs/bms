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

const QuotesMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.QUOTE_GET_ALL:
    {
      // Get all Quotes
      return DataManager.getAll(dispatch, action, '/quotes', DataManager.db_quotes, 'quotes')
                        .then(docs => next({ type: ACTION_TYPES.QUOTE_GET_ALL, payload: docs }));
    }

    case ACTION_TYPES.QUOTE_NEW:
    {
      const new_quote = Object.assign(action.payload, {object_number: getState().quotes.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_quotes, new_quote, '/quote', 'quotes')
                        .then(response => 
                          {
                            next(action);
                            // next({ type: ACTION_TYPES.QUOTE_GET_ALL, payload: docs });
                          });
    }

    case ACTION_TYPES.QUOTE_UPDATE:
    {
      console.log('quote update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_quotes, action.payload, '/quote', 'quotes')
                        .then(response => next({ type: ACTION_TYPES.QUOTE_UPDATE, payload: response }));
    }

    case ACTION_TYPES.QUOTE_ITEM_ADD:
    {
      console.log('quote item add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/quote/resource', 'quote resources')
                        .then(response =>
                          next({ type: ACTION_TYPES.QUOTE_ITEM_ADD, payload: response }));
    }

    case ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD:
    {
      // console.log('quote item extra cost add:', action.payload);
      // const new_extra_cost = Object.assign(action.payload, 
      //                         {
      //                           object_number: action.payload.quote_item.extra_costs ?
      //                             action.payload.quote_item.extra_costs.length : 0
      //                         });
      // console.log('new extra cost to be added:', new_extra_cost);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/quote/resource/extra_cost', 'quote resources')
                        .then(response =>
                          next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_UPDATE:
    {
      console.log('quote item extra cost update:', action.payload);
      return DataManager.postRemoteResource(dispatch, null, action.payload, '/quote/resource/extra_cost', 'quote resources')
                        .then(response=>
                          next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_UPDATE, payload: response }));
    }

    case ACTION_TYPES.QUOTE_EDIT:
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

    case ACTION_TYPES.QUOTE_DELETE:
    {
      // return deleteDoc('quotes', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.QUOTE_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:quote:deleted'),
      //       },
      //     });
      //     // Clear form if this quote is being editted
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

    case ACTION_TYPES.QUOTE_DUPLICATE:
    {
      const duplicateQuote = Object.assign({}, action.payload,
      {
        created_at: Date.now(),
        _id: uuidv4(),
        _rev: null,
      });
      return dispatch(
      {
        type: ACTION_TYPES.QUOTE_SAVE,
        payload: duplicateQuote,
      });
    }

    case ACTION_TYPES.QUOTE_CONFIGS_SAVE:
    {
      // const { quoteID, configs } = action.payload;
      // return getSingleDoc('quotes', quoteID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.QUOTE_UPDATE,
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

    case ACTION_TYPES.QUOTE_SET_STATUS:
    {
      // const { quoteID, status } = action.payload;
      // return getSingleDoc('quotes', quoteID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.QUOTE_UPDATE,
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

export default QuotesMW;
