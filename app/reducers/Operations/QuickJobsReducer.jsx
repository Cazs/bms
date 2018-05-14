import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/jobs';

const QuickJobsReducer = handleActions(
  {
    [combineActions(
      Actions.getQuickJobs,
      Actions.updateQuickJob
      // Actions.deleteQuickJob,
      // Actions.setQuickJobStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default QuickJobsReducer;

// Selector
const getQuickJobsState = (state) => state.quickjobs;

export const getQuickJobs = createSelector(
  getQuickJobsState,
  jobs => jobs
);
