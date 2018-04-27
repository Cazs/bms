import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getPurchaseOrders = createAction(ACTION_TYPES.PURCHASE_ORDER_GET_ALL);

export const savePurchaseOrder = createAction(
  ACTION_TYPES.PURCHASE_ORDER_SAVE,
  purchaseOrderData => purchaseOrderData
);

export const duplicatePurchaseOrder = createAction(
  ACTION_TYPES.PURCHASE_ORDER_DUPLICATE,
  (purchaseOrderData) => purchaseOrderData
);

export const deletePurchaseOrder = createAction(
  ACTION_TYPES.PURCHASE_ORDER_DELETE,
  purchaseOrderID => purchaseOrderID
);

export const editPurchaseOrder = createAction(
  ACTION_TYPES.PURCHASE_ORDER_EDIT,
  purchaseOrderData => purchaseOrderData
);

export const updatePurchaseOrder = createAction(
  ACTION_TYPES.PURCHASE_ORDER_UPDATE,
  updatedPurchaseOrder => updatedPurchaseOrder
);

export const setPurchaseOrderStatus = createAction(
  ACTION_TYPES.PURCHASE_ORDER_SET_STATUS,
  (purchaseOrderID, status) => ({ purchaseOrderID, status })
);

export const savePurchaseOrderConfigs = createAction(
  ACTION_TYPES.PURCHASE_ORDER_CONFIGS_SAVE,
  (purchaseOrderID, configs) => ({ purchaseOrderID, configs })
);
