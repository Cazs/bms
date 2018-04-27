import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getMaterials = createAction(ACTION_TYPES.MATERIAL_GET_ALL);

export const saveMaterial = createAction(
  ACTION_TYPES.MATERIAL_SAVE,
  materialData => materialData
);

export const duplicateMaterial = createAction(
  ACTION_TYPES.MATERIAL_DUPLICATE,
  (materialData) => materialData
);

export const deleteMaterial = createAction(
  ACTION_TYPES.MATERIAL_DELETE,
  materialID => materialID
);

export const editMaterial = createAction(
  ACTION_TYPES.MATERIAL_EDIT,
  materialData => materialData
);

export const updateMaterial = createAction(
  ACTION_TYPES.MATERIAL_UPDATE,
  updatedMaterial => updatedMaterial
);

export const setMaterialStatus = createAction(
  ACTION_TYPES.MATERIAL_SET_STATUS,
  (materialID, status) => ({ materialID, status })
);

export const saveMaterialConfigs = createAction(
  ACTION_TYPES.MATERIAL_CONFIGS_SAVE,
  (materialID, configs) => ({ materialID, configs })
);
