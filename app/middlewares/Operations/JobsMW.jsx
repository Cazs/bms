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

const JobsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.JOB_GET_ALL:
    {
      // Get all Jobs
      return DataManager.getAll(dispatch, action, '/jobs', DataManager.db_jobs, 'jobs')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || []})))
                        .catch(err =>
                          next({ type: ACTION_TYPES.JOB_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.JOB_NEW:
    {
      const new_job = Object.assign(action.payload, {object_number: getState().jobs.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_jobs, new_job, '/job', 'jobs')
                        .then(response =>
                        {
                          const job = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.JOB_NEW, payload: job });
                          if(action.callback)
                            action.callback(job);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.JOB_NEW, payload: []}));
    }

    case ACTION_TYPES.JOB_UPDATE:
    {
      console.log('job update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_jobs, action.payload, '/job', 'jobs')
                        .then(response =>
                          next({ type: ACTION_TYPES.JOB_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.JOB_UPDATE, payload: []}));
    }

    case ACTION_TYPES.QUICK_JOBS_GET_ALL:
    {
      // Get all QuickJobs
      return DataManager.getAll(dispatch, action, '/quickjobs', DataManager.db_quickjobs, 'quickjobs')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs  })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.QUICK_JOBS_GET_ALL, payload: []}));
    }
    
    case ACTION_TYPES.QUICK_JOB_NEW:
    {
      // const new_job = Object.assign(action.payload, {object_number: getState().jobs.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_quickjobs, action.payload, '/quickjob', 'quickjobs')
                        .then(response =>
                          next({ type: ACTION_TYPES.QUICK_JOB_NEW, payload: Object.assign(action.payload, {_id: response}) }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.QUICK_JOB_NEW, payload: []}));
    }

    case ACTION_TYPES.QUICK_JOB_UPDATE:
    {
      console.log('quick job update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_quickjobs, action.payload, '/quickjob', 'quickjobs')
                        .then(response =>
                          next({ type: ACTION_TYPES.QUICK_JOB_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.QUICK_JOB_UPDATE, payload: []}));
    }

    case ACTION_TYPES.JOB_TASK_ADD:
    {
      console.log('job task add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/job/task', 'job tasks')
                        .then(response =>
                          next({ type: ACTION_TYPES.JOB_TASK_ADD, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.JOB_TASK_ADD, payload: []}));
    }

    default: {
      return next(action);
    }
  }
};

export default JobsMW;
