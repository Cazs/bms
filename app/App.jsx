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

export const getQuotesTable = (quotes, state, quote_props, getCaret, isExpandableRow, expandComponent, expandColComponent, cellEditProp, clientFormatter, options) =>
{
  if(!quotes_table)
  {
    console.log('creating new quotes table instance');
    quotes_table =
    (
      <BootstrapTable
        id='tblQuotes'
        key='tblQuotes'
        data={quotes}
        striped
        hover
        insertRow={false}
        // selectRow={(row)=>alert(row)}
        selectRow={{bgColor: 'red'}}
        expandableRow={isExpandableRow}
        expandComponent={expandComponent}
        trStyle={(row) => ({background: 'lightblue'})}
        expandColumnOptions={{
          expandColumnVisible: true,
          expandColumnComponent: expandColComponent,
          columnWidth: 50}}
        cellEdit={cellEditProp}
        dataFormatter={clientFormatter}
        options={options}
        pagination
        // onScroll={}
        version='4' // bootstrap version
      >
        <TableHeaderColumn  
          // isKey
          dataField='_id'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed', left: '190px', background: 'lime'}}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_id_visible}
        > Quote ID
        </TableHeaderColumn>

        <TableHeaderColumn
          isKey
          dataField='object_number'
          dataSort
          caretRender={getCaret}
          // thStyle={() => {state.col_id_visible?({position: 'fixed', background: 'red' }):({background: 'lime'})}}
          // thStyle={state.col_id_visible?{position: 'fixed', left: '400px',background: 'lime'}:{position: 'fixed', background: 'red'}}
          // thStyle={{position: 'fixed', left: state.col_id_end + 'px', background: 'lime'}}
          tdStyle={() => {({'fontWeight': 'lighter'})}}
          hidden={!state.col_object_number_visible}
        > Quote Number
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='client_name'
          dataSort
          caretRender={getCaret}
          // editable={{type: 'select'}}
          customEditor={{
            getElement: (func, props) =>
              <ComboBox items={quotes_props.clients} selected_item={props.row.client} label='client_name' />
          }}
          // thStyle={{position: 'fixed', left: state.col_id_end + 240 + 'px', background: 'lime'}}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_client_id_visible}
        > Client
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='contact_person'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_contact_person_id_visible}
          customEditor={{
            getElement: (func, props) =>
              <ComboBox items={quote_props.users} selected_item={props.row.contact} label='name' />
          }}
        > Contact Person
        </TableHeaderColumn>
          
        <TableHeaderColumn
          dataField='sitename'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_sitename_visible}
        > Sitename
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='request'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_request_visible}
        >Request
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='vat'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_vat_visible}
        > VAT
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='revision'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_revision_visible}
        > Revision
        </TableHeaderColumn>
          
        <TableHeaderColumn
          dataField='status'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_status_visible}
        > Status
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='creator_name'
          dataSort
          // TODO: ref={creator_ref}
          caretRender={getCaret}
          // thStyle={{position: 'fixed', right: this.width, border: 'none' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_creator_visible}
        > Creator
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField='date_logged'
          dataSort
          caretRender={getCaret}
          // thStyle={{position: 'fixed', right: '-20px', border: 'none' }}
          tdStyle={{'fontWeight': 'lighter'}}
          hidden={!state.col_date_logged_visible}
        > Date Logged
        </TableHeaderColumn>
      </BootstrapTable>

    )
  }
    return quotes_table;
}

export default connect(state =>
(
  {
    ui: state.ui
  }
))(App);
