import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getJobs = createAction(ACTION_TYPES.JOB_GET_ALL);

export const saveJob = createAction(
  ACTION_TYPES.JOB_SAVE,
  jobData => jobData
);

export const duplicateJob = createAction(
  ACTION_TYPES.JOB_DUPLICATE,
  (jobData) => jobData
);

export const deleteJob = createAction(
  ACTION_TYPES.JOB_DELETE,
  jobID => jobID
);

export const editJob = createAction(
  ACTION_TYPES.JOB_EDIT,
  jobData => jobData
);

export const updateJob = createAction(
  ACTION_TYPES.JOB_UPDATE,
  updatedJob => updatedJob
);

export const setJobStatus = createAction(
  ACTION_TYPES.JOB_SET_STATUS,
  (jobID, status) => ({ jobID, status })
);

export const saveJobConfigs = createAction(
  ACTION_TYPES.JOB_CONFIGS_SAVE,
  (jobID, configs) => ({ jobID, configs })
);
