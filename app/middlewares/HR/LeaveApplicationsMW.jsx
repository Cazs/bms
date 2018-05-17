// Node Libs
import uuidv4 from 'uuid/v4';
const appConfig = require('electron').remote.require('electron-settings');
const ipc = require('electron').ipcRenderer;
import i18n from '../../../i18n/i18n';

// Actions & Verbs
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import * as DataManager from '../../helpers/DataManager';

const LeaveApplicationsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.LEAVE_GET_ALL:
    {
      // Get all LeaveApplications
      return DataManager.getAll(dispatch, action, '/leave_applications', DataManager.db_leave_applications, 'leave_applications')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || [] })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.LEAVE_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.LEAVE_NEW:
    {
      const new_leave_app = Object.assign(action.payload, {object_number: getState().leaveApplications.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_leave_applications, new_leave_app, '/leave_application', 'leave_applications')
                        .then(response => 
                        {
                          const leave = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.LEAVE_NEW, payload: leave });
                          if(action.callback)
                            action.callback(leave);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.LEAVE_NEW, payload: []}));
    }

    case ACTION_TYPES.LEAVE_UPDATE:
    {
      console.log('leave update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_leave_applications, action.payload, '/leave_application', 'leave_applications')
                        .then(response =>
                          next({ type: ACTION_TYPES.LEAVE_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.LEAVE_UPDATE, payload: []}));
    }

    default: {
      return next(action);
    }
  }
};

export default LeaveApplicationsMW;
