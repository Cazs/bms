import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getSuppliers = createAction(ACTION_TYPES.SUPPLIER_GET_ALL);

export const saveSupplier = createAction(
  ACTION_TYPES.SUPPLIER_SAVE,
  supplierData => supplierData
);

export const duplicateSupplier = createAction(
  ACTION_TYPES.SUPPLIER_DUPLICATE,
  (supplierData) => supplierData
);

export const deleteSupplier = createAction(
  ACTION_TYPES.SUPPLIER_DELETE,
  supplierID => supplierID
);

export const editSupplier = createAction(
  ACTION_TYPES.SUPPLIER_EDIT,
  supplierData => supplierData
);

export const updateSupplier = createAction(
  ACTION_TYPES.SUPPLIER_UPDATE,
  updatedSupplier => updatedSupplier
);

export const setSupplierStatus = createAction(
  ACTION_TYPES.SUPPLIER_SET_STATUS,
  (supplierID, status) => ({ supplierID, status })
);

export const saveSupplierConfigs = createAction(
  ACTION_TYPES.SUPPLIER_CONFIGS_SAVE,
  (supplierID, configs) => ({ supplierID, configs })
);
