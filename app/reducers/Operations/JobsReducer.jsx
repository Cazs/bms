import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/jobs';

const JobsReducer = handleActions(
  {
    [combineActions(
      Actions.getJobs,
      Actions.saveJob,
      Actions.saveJobConfigs,
      Actions.updateJob,
      Actions.deleteJob,
      Actions.setJobStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default JobsReducer;

// Selector
const getJobsState = (state) => state.jobs;

export const getJobs = createSelector(
  getJobsState,
  jobs => jobs
);
