import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/purchase_orders';

const PurchaseOrdersReducer = handleActions(
  {
    [combineActions(
      Actions.getPurchaseOrders,
      Actions.savePurchaseOrder,
      Actions.savePurchaseOrderConfigs,
      Actions.updatePurchaseOrder,
      Actions.deletePurchaseOrder,
      Actions.setPurchaseOrderStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default PurchaseOrdersReducer;

// Selector
const getPurchaseOrdersState = (state) => state.purchaseOrders;

export const getPurchaseOrders = createSelector(
  getPurchaseOrdersState,
  purchaseOrders => purchaseOrders
);
