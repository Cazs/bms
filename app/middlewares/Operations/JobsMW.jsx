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
                          const new_job = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.JOB_NEW, payload: new_job });
                          action.callback(new_job);
                        });
    }

    case ACTION_TYPES.JOB_UPDATE:
    {
      console.log('job update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_jobs, action.payload, '/job', 'jobs')
                        .then(response => next({ type: ACTION_TYPES.JOB_UPDATE, payload: response }));
    }

    case ACTION_TYPES.QUICK_JOBS_GET_ALL:
    {
      // Get all QuickJobs
      return DataManager.getAll(dispatch, action, '/quickjobs', DataManager.db_quickjobs, 'quickjobs')
                        .then(docs => next(Object.assign({}, action, { payload: docs  })));
    }
    
    case ACTION_TYPES.QUICK_JOB_NEW:
    {
      // const new_job = Object.assign(action.payload, {object_number: getState().jobs.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_quickjobs, action.payload, '/quickjob', 'quickjobs')
                        .then(response =>
                          next({ type: ACTION_TYPES.QUICK_JOB_NEW, payload: Object.assign(action.payload, {_id: response}) }));
    }

    case ACTION_TYPES.QUICK_JOB_UPDATE:
    {
      console.log('quick job update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_quickjobs, action.payload, '/quickjob', 'quickjobs')
                        .then(response => next({ type: ACTION_TYPES.QUICK_JOB_UPDATE, payload: response }));
    }

    case ACTION_TYPES.JOB_TASK_ADD:
    {
      console.log('job task add:', action.payload);
      return DataManager.putRemoteResource(dispatch, null, action.payload, '/job/task', 'job tasks')
                        .then(response => next({ type: ACTION_TYPES.JOB_TASK_ADD, payload: response }));
    }

    case ACTION_TYPES.JOB_SAVE:
    {
      // // Save doc to db
      // return saveDoc('jobs', action.payload)
      //   .then(newDocs => {
      //     next({
      //       type: ACTION_TYPES.JOB_SAVE,
      //       payload: newDocs,
      //     });
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:job:saved'),
      //       },
      //     });
      //     // Preview Window
      //     ipc.send('preview-job', action.payload);
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

    case ACTION_TYPES.JOB_EDIT:
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

    case ACTION_TYPES.JOB_DELETE:
    {
      // return deleteDoc('jobs', action.payload)
      //   .then(remainingDocs => {
      //     next({
      //       type: ACTION_TYPES.JOB_DELETE,
      //       payload: remainingDocs,
      //     });
      //     // Send Notification
      //     dispatch({
      //       type: ACTION_TYPES.UI_NOTIFICATION_NEW,
      //       payload: {
      //         type: 'success',
      //         message: i18n.t('messages:job:deleted'),
      //       },
      //     });
      //     // Clear form if this job is being editted
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

    case ACTION_TYPES.JOB_DUPLICATE:
    {
      // const duplicateJob = Object.assign({}, action.payload, {
      //   created_at: Date.now(),
      //   _id: uuidv4(),
      //   _rev: null,
      // })
      // return dispatch({
      //   type: ACTION_TYPES.JOB_SAVE,
      //   payload: duplicateJob,
      // });
    }

    case ACTION_TYPES.JOB_CONFIGS_SAVE:
    {
      // const { jobID, configs } = action.payload;
      // return getSingleDoc('jobs', jobID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.JOB_UPDATE,
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

    case ACTION_TYPES.JOB_SET_STATUS:
    {
      // const { jobID, status } = action.payload;
      // return getSingleDoc('jobs', jobID)
      //   .then(doc => {
      //     dispatch({
      //       type: ACTION_TYPES.JOB_UPDATE,
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

export default JobsMW;
