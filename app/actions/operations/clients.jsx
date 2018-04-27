import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getClients = createAction(ACTION_TYPES.CLIENT_GET_ALL);

export const saveClient = createAction(
  ACTION_TYPES.CLIENT_SAVE,
  clientData => clientData
);

export const duplicateClient = createAction(
  ACTION_TYPES.CLIENT_DUPLICATE,
  (clientData) => clientData
);

export const deleteClient = createAction(
  ACTION_TYPES.CLIENT_DELETE,
  clientID => clientID
);

export const editClient = createAction(
  ACTION_TYPES.CLIENT_EDIT,
  clientData => clientData
);

export const updateClient = createAction(
  ACTION_TYPES.CLIENT_UPDATE,
  updatedClient => updatedClient
);

export const setClientStatus = createAction(
  ACTION_TYPES.CLIENT_SET_STATUS,
  (clientID, status) => ({ clientID, status })
);

export const saveClientConfigs = createAction(
  ACTION_TYPES.CLIENT_CONFIGS_SAVE,
  (clientID, configs) => ({ clientID, configs })
);
