// Actions & Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';

import path  from 'path';
import Log from './Logger';

const NeDatastore = require('nedb');
// path.join(require('nw.gui').App.dataPath
// db.users = new Datastore('path/to/users.db');
// db.users.loadDatabase(); asynchronously

// export const db_users = new NeDatastore({ filename: path.join(__dirname,  '../db/users.db'), autoload: true });
export const db_employees = new NeDatastore({ filename: path.join(__dirname,  '../db/users.db'), autoload: true });
export const db_clients = new NeDatastore({ filename: path.join(__dirname,  '../db/clients.db'), autoload: true });
export const db_suppliers = new NeDatastore({ filename: path.join(__dirname,  '../db/suppliers.db'), autoload: true });
export const db_materials = new NeDatastore({ filename: path.join(__dirname,  '../db/materials.db'), autoload: true });
export const db_quotes = new NeDatastore({ filename: path.join(__dirname,  '../db/quotes.db'), autoload: true });
export const db_invoices = new NeDatastore({ filename: path.join(__dirname,  '../db/invoices.db'), autoload: true });
export const db_jobs = new NeDatastore({ filename: path.join(__dirname,  '../db/jobs.db'), autoload: true });
export const db_purchase_orders = new NeDatastore({ filename: path.join(__dirname,  '../db/purchase_orders.db'), autoload: true });
export const db_requisitions = new NeDatastore({ filename: path.join(__dirname,  '../db/requisitions.db'), autoload: true });

export const db_leave_applications = new NeDatastore({ filename: path.join(__dirname,  '../db/leave_applications.db'), autoload: true });
export const db_overtime_applications = new NeDatastore({ filename: path.join(__dirname,  '../db/overtime_applications.db'), autoload: true });

export const getAll = (dispatch, action, endpoint, db, collection_name) => new Promise((resolve, reject) =>
{
    // TODO:  check if local storage is up-to-date
    // const { HttpClient } = require('../helpers/HttpClient');
    // HttpClient.get('/timestamp/'+ collection_name + '_timestamp')
    // .then(response => console.log('timestamp for collection: %s is %s', collection_name, response)).catch(err => console.log(err));

    Log('verbose_info', 'querying local database for [' + collection_name + '] records.');
    getLocalResource( db, (err, docs) =>
    {
      if(err)
      {
        Log('error', err);
        return reject(err);
      }
      if(docs)
      {
        if(docs.length>0)
        {
          // found local records for db, resolve promise
          return resolve(docs);
        }
      }

      // try get remote resource
      Log('verbose_info', 'no local [' + collection_name + '] records, attempting to load from remote server.');

      // no local records, attempt to load from remote server
      getRemoteResource(dispatch, endpoint, collection_name, (embedded) =>
      {
        if(embedded)
        {
          // found remote resource
          const data = embedded[collection_name];

          // TODO: check why tables aren't refreshed after persisting data
          // save data to local disk
          db.insert(data, (error) =>
          {
            if(error)
            {
              Log('error', error);
              return;
            }
            Log('info', 'successfully persisted all [' + collection_name + '] records to local disk.');
          });
          resolve(data);
          // return data;
        }// else
        // {
        //   // execute callback without data
        //   callback([]);
        // }
        Log('warning', 'could not find any [' + collection_name + '] in the remote database');
        reject(new Error('could not find any [' + collection_name + '] in the remote database'), []);
      });
    });
});

const getLocalResource = (db, callback) =>
{
    db.find({}, (err, docs) => callback(err, docs));
}

const getRemoteResource = (dispatch, endpoint, collection_name, callback) => 
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.get(endpoint)
                      .then(response =>
                      { 
                        if(response)
                        {
                          if(response.status == 200) // Success, found some records
                          {
                            if(callback)
                                callback(response.data._embedded);
                            else dispatch(UIActions.newNotification('warning', 'Warning : No callback after getRemoteResource().'));
                          } else if(response.status == 204) // No content
                          {
                            dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                            // execute callback w/o args
                            if(callback)
                             callback([]);
                            // next(Object.assign({}, action, { payload: [] }));
                          } else { // Some other error
                            dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
                            // execute callback w/o args
                            if(callback)
                              callback([]);
                            // next(Object.assign({}, action, { payload: [] }));
                          }
                        } else { // No response
                          dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
                          // execute callback w/o args
                          if(callback)
                                callback([]);
                          // next(Object.assign({}, action, { payload: [] }));
                        }
                      })
                      .catch(err => 
                      {
                        dispatch(
                        {
                          type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                          payload:
                        {
                            type: 'warning',
                            message: err.message,
                          },
                        });
                      });
}

export const putRemoteResource = (dispatch, db, resource, endpoint, collection_name) =>  new Promise((resolve, reject) =>
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.put(endpoint, resource)
                      .then(response =>
                      { 
                        if(response)
                        {
                          if(response.status == 200) // Success, successfully created record
                          {
                            resolve(response);
                            dispatch(UIActions.newNotification('success', 'Successfully added a new record to collection ['+collection_name+']'));
                            // save to local store, if db is defined
                            if(db)
                            {
                              const new_quote_id = response.data;
                              db.insert(Object.assign(resource, {_id: new_quote_id}), (error) =>
                              {
                                if(error)
                                {
                                  Log('error', error);
                                  return;
                                }
                                Log('info', 'successfully persisted new record to local collection [' + collection_name + '].');
                              });
                            } else Log('warning', 'no db collection specified, not committing to local store, assuming you\'re taking care of this elsewhere.')
                          } else if(response.status == 204) // No content
                          {
                            reject(new Error('Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                            dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                          } else // Some other error
                          {
                            reject(new Error('Error: ' + response.status));
                            dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
                          }
                        } else // No response
                        {
                          reject(new Error('Error: Could not get a valid response from the server.'));
                          dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
                        }
                      })
                      .catch(err => 
                      {
                        dispatch(
                        {
                          type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                          payload:
                        {
                            type: 'warning',
                            message: err.message,
                          },
                        });
                      });
});

export const postRemoteResource = (dispatch, db, resource, endpoint, collection_name) =>  new Promise((resolve, reject) =>
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.post(endpoint, resource)
                      .then(response =>
                      { 
                        if(response)
                        {
                          if(response.status == 200) // Success, successfully updated record
                          {
                            dispatch(UIActions.newNotification('success', 'Successfully updated '+collection_name));
                            // TODO: return array from server then just resolve that
                            // update local store
                            const new_quote_id = response.data;
                            if(db)
                            {
                              db.update({_id: resource._id} ,resource, (error) =>
                              {
                                if(error)
                                {
                                  Log('error', error);
                                  return reject(error);
                                }
                                Log('info', 'successfully updated record on local collection [' + collection_name + '].');
                              });
                              // return updated local resources
                              getLocalResource(db, (err, docs) =>
                              {
                                if(err)
                                {
                                  Log('error', err);
                                  return reject(err);
                                }
                                resolve(docs);
                              });
                            } else
                            {
                              Log('warning', 'no db collection specified, not updating local store, assuming you\'re taking care of this elsewhere.');
                              resolve(response);
                            }
                          } else if(response.status == 204) // No content
                          {
                            reject(new Error('Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                            dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                          } else // Some other error
                          {
                            reject(new Error('Error: ' + response.status));
                            dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
                          }
                        } else // No response
                        {
                          reject(new Error('Error: Could not get a valid response from the server.'));
                          dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
                        }
                      })
                      .catch(err => 
                      {
                        dispatch(
                        {
                          type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                          payload:
                        {
                            type: 'warning',
                            message: err.message,
                          },
                        });
                      });
});