// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const ipc = require('electron').ipcRenderer;

/* Actions */
import * as UIActions from './actions/ui';
import * as SettingsActions from './actions/settings';
// Ops
// import * as UserActions from './actions/hr/users';
import * as EmployeeActions from './actions/hr/employees';
import * as ClientActions from './actions/operations/clients';
import * as SupplierActions from './actions/operations/suppliers';
import * as MaterialActions from './actions/operations/materials';
import * as QuoteActions from './actions/operations/quotes';
import * as JobActions from './actions/operations/jobs';
import * as InvoiceActions from './actions/operations/invoices';
import * as PurchaseOrderActions from './actions/operations/purchase_orders';
import * as RequisitionActions from './actions/operations/requisitions';

// HR
import * as LeaveApplicationActions from './actions/hr/leave_applications';
import * as OvertimeApplicationActions from './actions/hr/overtime_applications';

// Compliance
import * as ComplianceActions from './actions/compliance/safety';

// Components
import AppNav from './components/layout/AppNav';
import AppMain from './components/layout/AppMain';
import AppNotification from './components/layout/AppNotification';
import AppUpdate from './components/layout/AppUpdate';
import { AppWrapper } from './components/shared/Layout';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ComboBox from './components/shared/ComboBox';

let quotes_table;

// Components
class App extends PureComponent
{
  constructor(props)
  {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentDidMount()
  {
    const { dispatch } = this.props;
    dispatch(SettingsActions.getInitalSettings());
    
    // Get HR data
    dispatch(EmployeeActions.getEmployees());
    dispatch(LeaveApplicationActions.getLeaveApplications());
    dispatch(OvertimeApplicationActions.getOvertimeApplications());

    // // Get Operational data
    dispatch(ClientActions.getClients());
    dispatch(SupplierActions.getSuppliers());
    dispatch(MaterialActions.getMaterials());
    dispatch(QuoteActions.getQuotes());
    dispatch(JobActions.getJobs());
    dispatch(InvoiceActions.getInvoices());
    dispatch(PurchaseOrderActions.getPurchaseOrders());
    dispatch(RequisitionActions.getRequisitions());
    
    // // Get compliance document index
    dispatch(ComplianceActions.getSafetyDocuments());

    this.changeTab('operations');
    // Add Event Listener
    ipc.on('menu-change-tab', (event, tabName) => this.changeTab(tabName));
    // Save configs to invoice
    ipc.on('save-configs-to-invoice', (event, invoiceID, configs) => {}); // dispatch(InvoicesActions.saveInvoiceConfigs(invoiceID, configs));
  }

  componentWillUnmount()
  {
    ipc.removeAllListeners(
    [
      'menu-change-tab',
      'menu-form-save',
      'menu-form-clear',
      'menu-form-add-item',
      'menu-form-toggle-dueDate',
      'menu-form-toggle-currency',
      'menu-form-toggle-discount',
      'menu-form-toggle-vat',
      'menu-form-toggle-note',
      'menu-form-toggle-settings',
      // Save template configs to invoice
      'save-configs-to-invoice'
    ]);
  }

  changeTab(tabName)
  {
    const { dispatch } = this.props;
    dispatch(UIActions.changeActiveTab(tabName));
  }

  removeNotification(id)
  {
    const { dispatch } = this.props;
    dispatch(UIActions.removeNotification(id));
  }

  render()
  {
    const { activeTab, notifications, checkUpdatesMessage } = this.props.ui;
    return (
      <AppWrapper>
        <AppNav activeTab={activeTab} changeTab={this.changeTab} />
        <AppNotification notifications={notifications} removeNotification={this.removeNotification} />
        <AppMain activeTab={activeTab} />
      </AppWrapper>
    );
  }
}

App.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  ui: PropTypes.shape(
  {
    activeTab: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    checkUpdatesMessage: PropTypes.object,
  }).isRequired
};

export default connect(state =>
(
  {
    ui: state.ui
  }
))(App);
