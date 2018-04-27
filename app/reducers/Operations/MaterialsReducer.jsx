import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/materials';

const MaterialsReducer = handleActions(
  {
    [combineActions(
      Actions.getMaterials,
      Actions.saveMaterial,
      Actions.saveMaterialConfigs,
      Actions.updateMaterial,
      Actions.deleteMaterial,
      Actions.setMaterialStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default MaterialsReducer;

// Selector
const getMaterialsState = (state) => state.materials;

export const getMaterials = createSelector(
  getMaterialsState,
  materials => materials
);
