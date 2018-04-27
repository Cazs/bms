import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getRequisitions = createAction(ACTION_TYPES.REQUISITION_GET_ALL);

export const saveRequisition = createAction(
  ACTION_TYPES.REQUISITION_SAVE,
  requisitionData => requisitionData
);

export const duplicateRequisition = createAction(
  ACTION_TYPES.REQUISITION_DUPLICATE,
  (requisitionData) => requisitionData
);

export const deleteRequisition = createAction(
  ACTION_TYPES.REQUISITION_DELETE,
  requisitionID => requisitionID
);

export const editRequisition = createAction(
  ACTION_TYPES.REQUISITION_EDIT,
  requisitionData => requisitionData
);

export const updateRequisition = createAction(
  ACTION_TYPES.REQUISITION_UPDATE,
  updatedRequisition => updatedRequisition
);

export const setRequisitionStatus = createAction(
  ACTION_TYPES.REQUISITION_SET_STATUS,
  (requisitionID, status) => ({ requisitionID, status })
);

export const saveRequisitionConfigs = createAction(
  ACTION_TYPES.REQUISITION_CONFIGS_SAVE,
  (requisitionID, configs) => ({ requisitionID, configs })
);
