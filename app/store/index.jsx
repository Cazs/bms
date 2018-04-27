// Redux
import { createStore, applyMiddleware, compose } from 'redux';
import isDev from 'electron-is-dev';

// Root Reducer
import rootReducer from '../reducers';

// 3rd Party Middleware
import Logger from 'redux-logger';

// Common Middleware
import SettingsMW from '../middlewares/SettingsMW';
import UIMiddleware from '../middlewares/UIMiddleware';
import MeasureMW from '../middlewares/MeasureMW';

// Business Logic Related Middleware i.e. glorified event listeners

// Operations
import QuotesMW from '../middlewares/Operations/QuotesMW';
import ClientsMW from '../middlewares/Operations/ClientsMW';
import SuppliersMW from '../middlewares/Operations/SuppliersMW';
import MaterialsMW from '../middlewares/Operations/MaterialsMW';
import JobsMW from '../middlewares/Operations/JobsMW';
import InvoicesMW from '../middlewares/Operations/InvoicesMW';
import PurchaseOrdersMW from '../middlewares/Operations/PurchaseOrdersMW';
import RequisitionsMW from '../middlewares/Operations/RequisitionsMW';

// HR
import EmployeesMW from '../middlewares/HR/EmployeesMW';
import LeaveApplicationsMW from '../middlewares/HR/LeaveApplicationsMW';
import OvertimeApplicationsMW from '../middlewares/HR/OvertimeApplicationsMW';

// Compliance
import SafetyDocumentsMW from '../middlewares/Compliance/SafetyDocsMW'

const middlewares = 
[
  /* Common Middleware */
  SettingsMW,
  UIMiddleware,
  /* Business Logic Related Middleware */
  // HR
  EmployeesMW,
  LeaveApplicationsMW,
  OvertimeApplicationsMW,
  // Operations
  ClientsMW,
  SuppliersMW,
  MaterialsMW,
  QuotesMW,
  JobsMW,
  InvoicesMW,
  PurchaseOrdersMW,
  RequisitionsMW,
  // Compliance
  SafetyDocumentsMW
];

// Dev Mode Middlewares
if (isDev)
{
  middlewares.unshift(MeasureMW);
  middlewares.push(Logger);
}

// Redux Devtool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState)
{
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (module.hot)
  {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () =>
    {
      const nextReducer = require('../reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
