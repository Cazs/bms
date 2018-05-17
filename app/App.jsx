// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const ipc = require('electron').ipcRenderer;

/* Actions */
import * as UIActions from './actions/ui';
import * as SettingsActions from './actions/settings';

// Components
import AppNav from './components/layout/AppNav';
import AppMain from './components/layout/AppMain';
import AppNotification from './components/layout/AppNotification';
// import AppUpdate from './components/layout/AppUpdate';
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
    this.setLoading = this.setLoading.bind(this);

    this.state = {
      is_loading: false
    };
  }

  setLoading(val)
  {
    this.setState({is_loading: val});
  }

  componentDidMount()
  {
    const { dispatch } = this.props;
    dispatch(SettingsActions.getInitalSettings());

    this.changeTab('login');
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
    // checkUpdatesMessage
    const { activeTab, notifications } = this.props.ui;
    return (
      <AppWrapper>
        <div style={{
          position: 'fixed',
          visibility: this.state.is_loading ? 'visible' : 'hidden',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,.5)',
          zIndex: '100'
        }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              margin: '27% auto 0px auto',
              background: 'url(../static/images/loading.gif)',
              backgroundSize: 'contain',
              zIndex: '10000'
            }}
          />
        </div>
        {activeTab !== 'home' && activeTab !== 'login' && activeTab !== 'signup' ? 
          <AppNav activeTab={activeTab} changeTab={this.changeTab} />
          : '' }
        <AppNotification notifications={notifications} removeNotification={this.removeNotification} />
        <AppMain activeTab={activeTab} changeTab={this.changeTab} setLoading={this.setLoading} />
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
    // checkUpdatesMessage: PropTypes.object,
  }).isRequired
};

export default connect(state =>
(
  {
    ui: state.ui
  }
))(App);
