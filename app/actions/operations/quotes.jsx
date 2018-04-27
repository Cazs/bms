import * as ACTION_TYPES from '../../constants/actions.jsx';
import { createAction } from 'redux-actions';

export const getQuotes = createAction(ACTION_TYPES.QUOTE_GET_ALL);

export const saveQuote = createAction(
  ACTION_TYPES.QUOTE_SAVE,
  quoteData => quoteData
);

export const duplicateQuote = createAction(
  ACTION_TYPES.QUOTE_DUPLICATE,
  (quoteData) => quoteData
);

export const deleteQuote = createAction(
  ACTION_TYPES.QUOTE_DELETE,
  quoteID => quoteID
);

export const editQuote = createAction(
  ACTION_TYPES.QUOTE_EDIT,
  quoteData => quoteData
);

export const updateQuote = createAction(
  ACTION_TYPES.QUOTE_UPDATE,
  updatedQuote => updatedQuote
);

export const setQuoteStatus = createAction(
  ACTION_TYPES.QUOTE_SET_STATUS,
  (quoteID, status) => ({ quoteID, status })
);

export const saveQuoteConfigs = createAction(
  ACTION_TYPES.QUOTE_CONFIGS_SAVE,
  (quoteID, configs) => ({ quoteID, configs })
);
