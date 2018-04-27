import { handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import * as Actions from '../../actions/operations/quotes';

const QuotesReducer = handleActions(
  {
    [combineActions(
      Actions.getQuotes,
      Actions.saveQuote,
      Actions.saveQuoteConfigs,
      Actions.updateQuote,
      Actions.deleteQuote,
      Actions.setQuoteStatus
    )]: (state, action) => action.payload,
  },
  []
);

export default QuotesReducer;

// Selector
const getQuotesState = (state) => state.quotes;

export const getQuotes = createSelector(
  getQuotesState,
  quotes => quotes
);
