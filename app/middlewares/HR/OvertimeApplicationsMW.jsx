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

const OvertimeApplicationsMW = ({ dispatch, getState }) => next => action =>
{
  switch (action.type)
  {
    case ACTION_TYPES.OVERTIME_GET_ALL:
    {
      // Get all OvertimeApplications
      return DataManager.getAll(dispatch, action, '/overtime_applications', DataManager.db_overtime_applications, 'overtime_applications')
                        .then(docs =>
                          next(Object.assign({}, action, { payload: docs || []  })))
                        .catch(err =>
                          next({ type: ACTION_TYPES.OVERTIME_GET_ALL, payload: []}));
    }

    case ACTION_TYPES.OVERTIME_NEW:
    {
      const new_overtime_app = Object.assign(action.payload, {object_number: getState().overtimeApplications.length});
      // Save to remote store then local store
      return DataManager.putRemoteResource(dispatch, DataManager.db_overtime_applications, new_overtime_app, '/overtime_application', 'overtime_applications')
                        .then(response => 
                        {
                          const overtime = Object.assign(action.payload, {_id: response}); // w/ _id
                          next({ type: ACTION_TYPES.OVERTIME_NEW, payload: overtime });
                          if(action.callback)
                            action.callback(overtime);
                        })
                        .catch(err =>
                          next({ type: ACTION_TYPES.OVERTIME_NEW, payload: []}));
    }

    case ACTION_TYPES.OVERTIME_UPDATE:
    {
      console.log('overtime update:', action.payload);
      return DataManager.postRemoteResource(dispatch, DataManager.db_overtime_applications, action.payload, '/overtime_application', 'overtime_applications')
                        .then(response =>
                          next({ type: ACTION_TYPES.OVERTIME_UPDATE, payload: response }))
                        .catch(err =>
                          next({ type: ACTION_TYPES.OVERTIME_UPDATE, payload: []}));
    }

    default: {
      return next(action);
    }
  }
};

export default OvertimeApplicationsMW;
