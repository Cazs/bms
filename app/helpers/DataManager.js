// Actions & Verbs
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';

import path  from 'path';
import Log from './Logger';
import sessionManager from './SessionManager';
import Store from './Store';

// const NeDatastore = require('nedb');
// path.join(require('nw.gui').App.dataPath
// db.users = new Datastore('path/to/users.db');
// db.users.loadDatabase(); asynchronously

// export const db_users = new NeDatastore({ filename: path.join(__dirname,  '../db/users.db'), autoload: true });
/* export const db_employees = new NeDatastore({ filename: path.join(__dirname,  '../db/users.db'), autoload: true });
export const db_clients = new NeDatastore({ filename: path.join(__dirname,  '../db/clients.db'), autoload: true });
export const db_suppliers = new NeDatastore({ filename: path.join(__dirname,  '../db/suppliers.db'), autoload: true });
export const db_materials = new NeDatastore({ filename: path.join(__dirname,  '../db/materials.db'), autoload: true });
export const db_quotes = new NeDatastore({ filename: path.join(__dirname,  '../db/quotes.db'), autoload: true });
export const db_invoices = new NeDatastore({ filename: path.join(__dirname,  '../db/invoices.db'), autoload: true });
export const db_jobs = new NeDatastore({ filename: path.join(__dirname,  '../db/jobs.db'), autoload: true });
export const db_quickjobs = new NeDatastore({ filename: path.join(__dirname,  '../db/quick_jobs.db'), autoload: true });
export const db_purchase_orders = new NeDatastore({ filename: path.join(__dirname,  '../db/purchase_orders.db'), autoload: true });
export const db_requisitions = new NeDatastore({ filename: path.join(__dirname,  '../db/requisitions.db'), autoload: true });

export const db_leave_applications = new NeDatastore({ filename: path.join(__dirname,  '../db/leave_applications.db'), autoload: true });
export const db_overtime_applications = new NeDatastore({ filename: path.join(__dirname,  '../db/overtime_applications.db'), autoload: true });

export const db_safety_documents = new NeDatastore({ filename: path.join(__dirname,  '../db/safety_documents.db'), autoload: true }); */

export const db_counters = new Store('counters');
export const db_employees = new Store('users'); // new NeDatastore({ filename: 'users.db', autoload: true });
export const db_clients = new Store('clients'); // new NeDatastore({ filename: 'clients.db', autoload: true });
export const db_suppliers = new Store('suppliers'); // new NeDatastore({ filename: 'suppliers.db', autoload: true });
export const db_materials = new Store('materials'); // new NeDatastore({ filename: 'materials.db', autoload: true });
export const db_quotes = new Store('quotes'); // new NeDatastore({ filename: 'quotes.db', autoload: true });
export const db_invoices = new Store('invoices'); // new NeDatastore({ filename: 'invoices.db', autoload: true });
export const db_jobs = new Store('jobs'); // new NeDatastore({ filename: 'jobs.db', autoload: true });
export const db_quickjobs = new Store('quick_jobs'); // new NeDatastore({ filename: 'quick_jobs.db', autoload: true });
export const db_purchase_orders = new Store('purchase_orders'); // new NeDatastore({ filename: 'purchase_orders.db', autoload: true });
export const db_requisitions = new Store('requisitions'); // new NeDatastore({ filename: 'requisitions.db', autoload: true });
export const db_leave_applications = new Store('leave_applications'); // new Store({configName: 'users'}); new NeDatastore({ filename: 'leave_applications.db', autoload: true });
export const db_overtime_applications = new Store('overtime_applications'); // new NeDatastore({ filename: 'overtime_applications.db', autoload: true });
export const db_safety_documents = new Store('safety_documents'); // new NeDatastore({ filename: 'safety_documents.db', autoload: true });

export const authenticate = (dispatch, user) =>  new Promise((resolve, reject) =>
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.put('/session', {}, {headers: {'usr': user.username, 'pwd': user.password, 'Content-Type': 'application/json'}})
                      .then(response =>
                      {
                        if(response)
                        {
                          if(response.status == 200) // Success, successfully signed in
                          {
                            resolve(response.data); // resolve session data
                            dispatch(UIActions.newNotification('success', 'User ['+user.username+'] has successfully signed in.'));
                          } else // Some other error
                          {
                            reject(new Error('Error: ' + response.status));
                            return dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
                          }
                        } else // No response
                        {
                          reject(new Error('Error: Could not get a valid response from the server.'));
                          return dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
                        }
                      })
                      .catch(err => 
                      {
                        // else if(response.status == 404) // Not found
                        console.log(err);
                        reject(new Error('Invalid user credentials.'));
                        dispatch(UIActions.newNotification('warning', 'Error: Invalid user credentials.'));
                      });
});

export const getAll = (dispatch, action, endpoint, db, collection_name) => new Promise((resolve, reject) =>
{
    // TODO:  check if local storage is up-to-date
    const { HttpClient } = require('../helpers/HttpClient');
    // HttpClient.get('/timestamp/'+ collection_name + '_timestamp')
    // .then(response => console.log('timestamp for collection: %s is %s', collection_name, response)).catch(err => console.log(err));

    // dispatch(UIActions.newNotification('primary', 'querying local database for [' + collection_name + '] records.'));    
    Log('verbose_info', 'querying local database for [' + collection_name + '] records.');
    HttpClient.get('/timestamp/' + collection_name + '_timestamp')
              .then(srv_response =>
              {
                if(srv_response.status == 200)
                {
                  console.log('srv_response#####', srv_response);
                  if(srv_response.data)
                  {
                    const remote_timestamp = srv_response.data;
                    const current_timestamp = db_counters.get(collection_name + '_timestamp');

                    if(!current_timestamp || current_timestamp.count !== remote_timestamp.count)
                    {
                      Log('info', '>>>>>local ' + collection_name + ' collection is not up-to-date with server, synchronizing...');

                      return getRemoteResource(dispatch, endpoint, collection_name, (embedded) =>
                      {
                        if(embedded)
                        {
                          // found remote resource
                          const data = embedded[collection_name];

                          // save data to local disk
                          if(data)
                          {
                            // update local collection
                            db.set(collection_name, data);

                            // update local timestamp for collection
                            db_counters.set(collection_name + '_timestamp', remote_timestamp);
                            return resolve(data);
                          }
                        }
                        Log('warning', 'could not find any [' + collection_name + '] in the remote database');
                        return reject(new Error('could not find any [' + collection_name + '] in the remote database'), []);
                        // dispatch(UIActions.newNotification('danger', 'could not find any [' + collection_name + '] in the remote database'));
                      });
                    }
                    // local data apparently is up-to-date with server - according to collection's timestamp
                    return getLocalResource( db, (docs) =>
                    {
                      if(docs)
                      {
                        if(docs.length>0)
                        {
                          Log('info', 'found ['+docs.length+'] local [' + collection_name + '] records.');    
                          // found local records for db, resolve promise
                          return resolve(docs);
                        } 
                      }

                      // no local records, i.e., the local timestamp lied, attempt to load from remote server
                      Log('verbose_info', 'no local [' + collection_name + '] records, attempting to load from remote server.');

                      return getRemoteResource(dispatch, endpoint, collection_name, (embedded) =>
                      {
                        if(embedded)
                        {
                          // found remote resource
                          const data = embedded[collection_name];

                          // save data to local disk
                          if(data)
                          {
                            db.set(collection_name, data);
                            return resolve(data);
                          }
                        }
                        // no remote or local resources
                        Log('warning', 'could not find any [' + collection_name + '] in the remote database');
                        return reject(new Error('could not find any [' + collection_name + '] in the remote database'), []);
                        // dispatch(UIActions.newNotification('danger', 'could not find any [' + collection_name + '] in the remote database'));
                      });
                    });
                  }  // no timestamp from server, i.e. no records
                  Log('error', 'could not get remote timestamp for collection ['+collection_name+'], assuming no remote records.');
                  // dispatch(UIActions.newNotification('warn', 'no ' + collection_name + ' records were found in the remote server.'));
                } else dispatch(UIActions.newNotification('danger', 'Error ' + srv_response.status + ': ' + (srv_response.statusText || srv_response.data)));
              });
});

const getLocalResource = (db, callback) =>
{
    // db.find({}, (err, docs) => callback(err, docs));
    if(callback)
      callback(db.getAll());
}

export const updateLocalResource = (dispatch, db, resource, collection_name) =>  new Promise((resolve, reject) =>
{
  if(!resource)
  {
    dispatch(UIActions.newNotification('danger', 'Invalid '+collection_name+' resource to be updated.'));
    return reject(new Error('Invalid '+collection_name+' resource to be updated.'));
  }
  // TODO: return array from server then just resolve that
  // update local store
  if(db)
  {
    db.update({_id: resource._id} ,resource, (error) =>
    {
      if(error)
      {
        Log('error', error);
        return reject(error);
      }
      dispatch(UIActions.newNotification('success', 'Successfully updated local '+collection_name));
      resolve(resource);
      Log('info', 'successfully updated record on local collection [' + collection_name + '].');
    });
    // TODO: return updated document or all documents?
    // return updated local documents
    // getLocalResource(db, (err, docs) =>
    // {
    //   if(err)
    //   {
    //     Log('error', err);
    //     return reject(err);
    //   }
    //   resolve(docs);
    // });
  } else
  {
    Log('warning', 'no db collection specified.');
    reject(new Error('invalid database collection'));
  }
});

const getRemoteResource = (dispatch, endpoint, collection_name, callback) => 
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.get(endpoint, {headers: {'Content-Type': 'application/json;', session_id: sessionManager.getSessionId()}})
                      .then(response =>
                      { 
                        if(response)
                        {
                          if(response.status == 200) // Success, found some records
                          {
                            if(callback)
                                callback(response.data._embedded);
                            else return dispatch(UIActions.newNotification('warning', 'Warning : No callback after getRemoteResource().'));
                          } else if(response.status == 204) // No content
                          {
                            Log('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.');
                            // dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                            // execute callback w/o args
                            if(callback)
                              callback([]);
                            // next(Object.assign({}, action, { payload: [] }));
                          } else if(response.status == 401) // Unauthorised
                          {
                            if(callback)
                              callback(new Error('Error ['+response.status+']: You are not authorised to view ' + collection_name));
                            return dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: You are not authorised to view ' + collection_name));
                          } else { // Some other error
                            // execute callback w/o args
                            if(callback)
                              callback([]);
                            // next(Object.assign({}, action, { payload: [] }));
                            return dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
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
    return HttpClient.put(endpoint, resource, {headers: {'Content-Type': 'application/json;', session_id: sessionManager.getSessionId()}})
                      .then(response =>
                      {
                        if(response)
                        {
                          if(response.status == 200) // Success, successfully created record
                          {
                            resolve(response.data);
                            if(resource.status !== 3) // if resource is not a silent/invisible resource notify user about it's creation
                              dispatch(UIActions.newNotification('success', 'Successfully added a new record to '+collection_name+' collection.'));
                            // save to local store, if db is defined
                            if(db)
                            {
                              Log('verbose_info', 'new ' + collection_name + ' object _id: ' + response.data);
                              const new_obj_id = response.data;
                              db.set(collection_name, Object.assign(resource, {_id: new_obj_id}));
                            } else Log('warning', 'no db collection specified, not committing to local store, assuming you\'re taking care of this elsewhere.')
                          } else if(response.status == 204) // No content
                          {
                            Log('error', 'Error ['+response.status+']: No '+collection_name+' were found in the database.');
                            return reject(new Error('Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                            // dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: No '+collection_name+' were found in the database.'));
                          } else if(response.status == 401) // Unauthorised
                          {
                            reject(new Error('Error ['+response.status+']: You are not authorised to create ' + collection_name));
                            return dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: You are not authorised to create ' + collection_name));
                          } else // Some other error
                          {
                            reject(new Error('Error: ' + response.status));
                            return dispatch(UIActions.newNotification('danger', 'Error: ' + response.status));
                          }
                        } else // No response
                        {
                          reject(new Error('Error: Could not get a valid response from the server.'));
                          return dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
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
  if(!resource)
  {
    dispatch(UIActions.newNotification('danger', 'Invalid '+collection_name+' resource to be updated.'));
    return reject(new Error('Invalid '+collection_name+' resource to be updated.'));
  }
  const { HttpClient } = require('../helpers/HttpClient');
  return HttpClient.post(endpoint, resource, {headers: {'Content-Type': 'application/json;', session_id: sessionManager.getSessionId()}})
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
                            // db.update({_id: resource._id} ,resource, (error) =>
                            // {
                            //   if(error)
                            //   {
                            //     Log('error', error);
                            //     return reject(error);
                            //   }
                            //   Log('info', 'successfully updated record on local collection [' + collection_name + '].');
                            // });
                            Log('info', 'successfully updated record on remote collection, updating local collection [' + collection_name + '].');
                            db.set(collection_name, resource);
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
                        } else if(response.status == 401) // Unauthorised
                        {
                          reject(new Error('Error ['+response.status+']: You are not authorised to make changes to ' + collection_name));
                          dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: You are not authorised to make changes to ' + collection_name));
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

export const emailDocument = (dispatch, email, endpoint) =>  new Promise((resolve, reject) =>
{
    const { HttpClient } = require('../helpers/HttpClient');
    return HttpClient.post(endpoint, email, {_id: 'test', message: 'test', subject: 'test', headers: {'Content-Type': 'application/json;', session_id: sessionManager.getSessionId()}})
                      .then(response =>
                      { 
                        if(response)
                        {
                          if(response.status == 200) // Success, successfully emailed documetn
                          {
                            dispatch(UIActions.newNotification('success', 'Successfully emailed document.'));
                            resolve(response);
                          } else if(response.status == 401) // Unauthorised
                          {
                            reject(new Error('Error ['+response.status+']: You are not authorised to email documents.'));
                            dispatch(UIActions.newNotification('warning', 'Error ['+response.status+']: You are not authorised to email documents.'));
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