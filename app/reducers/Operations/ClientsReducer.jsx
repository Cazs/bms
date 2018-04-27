import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/clients';

const ClientsReducer = handleActions(
  {
    [combineActions(
      Actions.getClients,
      Actions.saveClient,
      Actions.saveClientConfigs,
      Actions.updateClient,
      Actions.deleteClient,
      Actions.setClientStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default ClientsReducer;

// Selector
const getClientsState = (state) => state.clients;

export const getClients = createSelector(
  getClientsState,
  clients => clients
);
