import { combineReducers } from 'redux';

// Generic Reducers
import UIReducer from './UIReducer';
import SettingsReducer from './SettingsReducer';

// Operational Reducers
import QuotesReducer from './Operations/QuotesReducer';
import MaterialsReducer from './Operations/MaterialsReducer';
import JobsReducer from './Operations/JobsReducer';
import ClientsReducer from './Operations/ClientsReducer';
import SuppliersReducer from './Operations/SuppliersReducer';
import InvoicesReducer from './Operations/InvoicesReducer';
import PurchaseOrdersReducer from './Operations/PurchaseOrdersReducer';
import RequisitionReducer from './Operations/RequisitionsReducer';

// HR Reducers
import EmployeesReducer from './HR/EmployeesReducer';
import LeaveApplicationsReducer from './HR/LeaveApplicationsReducer';
import OvertimeApplicationsReducer from './HR/OvertimeApplicationsReducer';

// Compliance Reducers
import SafetyDocsReducer from './Compliance/SafetyDocsReducer';

export default combineReducers(
{
  // general
  ui: UIReducer,
  settings: SettingsReducer,
  // operations
  quotes: QuotesReducer,
  employees: EmployeesReducer,
  clients: ClientsReducer,
  suppliers: SuppliersReducer,
  materials: MaterialsReducer,
  invoices: InvoicesReducer,
  purchaseOrders: PurchaseOrdersReducer,
  requisitions: RequisitionReducer,
  jobs: JobsReducer,
  // hr
  leaveApplications: LeaveApplicationsReducer,
  overtimeApplications: OvertimeApplicationsReducer,
  // compliance
  safetyDocuments: SafetyDocsReducer
});
