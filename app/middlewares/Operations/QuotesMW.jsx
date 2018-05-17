// Node Libs
import uuidv4 from 'uuid/v4';
import currencies from '../../../libs/currencies.json';
import { ipcMain } from 'electron';

import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import  * as DataManager from '../../helpers/DataManager';

const QuotesMW = ({ dispatch, getState }) => next => (action) =>
{
  switch (action.type)
  {
    case ACTION_TYPES.QUOTE_GET_ALL:
    {
      // Get all Quotes
      return DataManager.getAll(dispatch, action, '/quotes', DataManager.db_quotes, 'quotes')
                        .then(docs =>
                          next({ type: ACTION_TYPES.QUOTE_GET_ALL, payload: docs || []}))
                        .catch(err =>
                          next({ type: ACTION_TYPES.QUOTE_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.QUOTE_NEW:
    {
      const new_quote = Object.assign(action.payload, {object_number: getState().quotes.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_quotes, new_quote, '/quote', 'quotes')
                        .then(response =>
                        {
                          const quote = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.QUOTE_NEW, payload: quote });
                          if(action.callback)
                            action.callback(quote);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.PURCHASE_ORDER_NEW, payload: []}));
    }

    case ACTION_TYPES.QUOTE_UPDATE:
    {
      console.log('quote update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_quotes, action.payload, '/quote', 'quotes')
                        .then(response => next({ type: ACTION_TYPES.QUOTE_UPDATE, payload: response }));
    }

    case ACTION_TYPES.LOCAL_QUOTE_UPDATE:
    {
      console.log('local quote update:', action.payload);
      // return DataManager.db_quotes.insert(action.payload, (error) =>
      // {
      //   if(error)
      //   {
      //     console.log('error: %s', error);
      //   } else dispatch(UIActions.newNotification('success', 'Successfully updated local quotes'));
      //   // Log('info', 'successfully updated record on local collection [' + collection_name + '].');
      //   next({ type: ACTION_TYPES.LOCAL_QUOTE_UPDATE, payload: action.payload });
      // });

      // return DataManager.db_quotes.update(action.payload, { $inc: { distance: 1 } }, { upsert: true }, (err) =>
      // {
      //   if (err)
      //   {
      //     console.log('Oops!: %s', err);
      //   } else
      //   {
      //     setImmediate(() =>
      //     {
      //       DataManager.db_quotes.count({ '0': 10 }, (err, count) =>
      //       {
      //         console.log('Count: ' + count);
      //       });
      //     });
      //     console.log('Yeah!');
      //   }
      // });

      // return DataManager.db_quotes.find({_id: action.payload._id}, (err, docs)=>
      // {
      //   if(err)
      //   {
      //     console.log('error: ' + err);
      //   } else console.log(docs);
      //   // next({ type: ACTION_TYPES.LOCAL_QUOTE_UPDATE, payload: action.payload });
      //   const new_quote = Object.assign(docs[0], {resources: action.payload.resources});
      //   return DataManager.updateLocalResource(dispatch, DataManager.db_quotes, new_quote, 'quotes')
      //                   .then(response => next({ type: ACTION_TYPES.LOCAL_QUOTE_UPDATE, payload: new_quote }));
      // });
      
      return DataManager.updateLocalResource(dispatch, DataManager.db_quotes, action.payload, 'quotes')
                        .then(response => next({ type: ACTION_TYPES.LOCAL_QUOTE_UPDATE, payload: response }));
    }

    case ACTION_TYPES.QUOTE_ITEM_ADD:
    {
      console.log('quote item add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/quote/resource', 'quote resources')
                        .then(response =>
                        {
                          const new_quote_item = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.QUOTE_ITEM_ADD, payload: new_quote_item })
                          action.callback(new_quote_item);
                        });
    }

    case ACTION_TYPES.QUOTE_ITEM_UPDATE:
    {
      console.log('quote item update:', action.payload);
      return DataManager.postRemoteResource(dispatch, null, action.payload, '/quote/resource', 'quote resources')
                        .then(response => next({ type: ACTION_TYPES.QUOTE_ITEM_UPDATE, payload: response }));
    }
    
    case ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD:
    {
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/quote/resource/extra_cost', 'quote resources')
                        // .then(response =>
                          // next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD, payload: Object.assign(action.payload, {_id: response}) }));
                        .then(response =>
                          {
                            const new_extra_cost = Object.assign(action.payload, {_id: response}); // w/ _id
                            next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD, payload: new_extra_cost })
                            action.callback(new_extra_cost);
                          });
    }

    case ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_UPDATE:
    {
      console.log('quote item extra cost update:', action.payload);
      return DataManager.postRemoteResource(dispatch, null, action.payload, '/quote/resource/extra_cost', 'quote resources')
                        .then(response =>
                          {
                            next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD, payload: action.payload })
                            action.callback(action.payload);
                          });
                        // .then(response=>
                          // next({ type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_UPDATE, payload: response }));
    }

    case ACTION_TYPES.QUOTE_MATERIAL_NEW:
    {
      console.log('creating new resource for quote item.');
      // first create new resource
      const new_resource = Object.assign(action.payload.resource, {object_number: getState().materials.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_materials, new_resource, '/resource', 'resources')
                        .then(response => 
                        {
                            console.log('successfully created resource, creating new quote item');
                            // TODO: push to global materials?
                            const new_mat = Object.assign(action.payload.resource, {_id: response});
                            
                            // then create QuoteItem on remote store then local store
                            const quote_item = Object.assign({resource_id: response, resource: new_mat}, action.payload);

                            // ipcMain.send('create-quote-item', quote_item);
                            // const mainWindowID = appConfig.get('mainWindowID');
                            // const mainWindow = require('electron').BrowserWindow.fromId(mainWindowID);
                            // mainWindow.webContents.send('create-quote-item', quote_item);

                            // quote_item.quote.resources.push(quote_item);
                            // // dispatch action to create quote item
                            // dispatch({
                            //   type: ACTION_TYPES.QUOTE_ITEM_ADD,
                            //   payload: quote_item
                            // });

                            next({ type: ACTION_TYPES.QUOTE_MATERIAL_NEW, payload: new_mat });
                            action.callback(quote_item);
                        });
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
