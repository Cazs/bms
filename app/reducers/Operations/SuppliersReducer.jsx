import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/suppliers';

const SuppliersReducer = handleActions(
  {
    [combineActions(
      Actions.getSuppliers,
      Actions.saveSupplier,
      Actions.saveSupplierConfigs,
      Actions.updateSupplier,
      Actions.deleteSupplier,
      Actions.setSupplierStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default SuppliersReducer;

// Selector
const getSuppliersState = (state) => state.suppliers;

export const getSuppliers = createSelector(
  getSuppliersState,
  suppliers => suppliers
);
