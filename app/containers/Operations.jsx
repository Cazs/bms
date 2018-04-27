// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { translate } from 'react-i18next';
const ipc = require('electron').ipcRenderer;

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';
import { Tab, Tabs, TabContent } from '../components/shared/Tabs';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../components/shared/Layout';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';

// Selectors
// import { getQuotes } from '../reducers/QuotesReducer';

// Tab content Components
import Quotes from './Operations/Quotes';
import Jobs from './Operations/Jobs';
import Invoices from './Operations/Invoices';
import Requisitions from './Operations/Requisitions';
import PurchaseOrders from './Operations/PurchaseOrders';

// Component
class Operations extends Component
{
  constructor(props)
  {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.state = { visibleTab: 'Quotes' };
    this.header_actions = React.createRef();
  }

  componentDidMount()
  {
    // Add Event Listener
    ipc.on('change-operations-tab', (event, tab_num) =>
    {
      this.changeTab(tab_num);
    });
  }

   // Remove all IPC listeners when unmounted
   componentWillUnmount()
   {
     ipc.removeAllListeners('change-operations-tab');
   }

  // Switch Tab
  changeTab(tabNum)
  {
    this.setState({ visibleTab: tabNum });
  }

  // Render Main Content

  render()
  {
    const { t } = this.props;
    const { quotes } = this.props;

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Operations | {this.state.visibleTab}</PageHeaderTitle>
          <PageHeaderActions ref={this.header_actions}>
            <div style={{display: 'inline', float: 'right', marginTop: '-30px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
              {/* <Button primary>
                {t('common:save')}
              </Button> */}
              <Button primary>
                New Client
              </Button>
              <Button primary>
                New Supplier
              </Button>
              <Button primary>
                New Stock Item
              </Button>
            </div>
          </PageHeaderActions>
          <Tabs style={{backgroundColor: 'lime', borderTop: '2px solid black', marginTop: '30px', zIndex: '90'}}>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Quotes' ? 'active' : ''}
              onClick={() => this.changeTab('Quotes')}
            >
              {t('Quotes')}
            </Tab>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Jobs' ? 'active' : ''}
              onClick={() => this.changeTab('Jobs')}
            >
              {t('Jobs')}
            </Tab>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Invoices' ? 'active' : ''}
              onClick={() => this.changeTab('Invoices')}
            >
              {t('Invoices')}
            </Tab>
            <Tab
              href="#"
              className={this.state.visibleTab === 'POs' ? 'active' : ''}
              onClick={() => this.changeTab('POs')}
            >
              {t('Purchase Orders')}
            </Tab>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Requisitions' ? 'active' : ''}
              onClick={() => this.changeTab('Requisitions')}
            >
              {t('Requisitions')}
            </Tab>
          </Tabs>
        </PageHeader>
        <PageContent>
          
          <TabContent>
            {this.state.visibleTab === 'Quotes' && (
              // <Profile t={t} />
              <Quotes />
            )}
            {this.state.visibleTab === 'Jobs' && (
              <Jobs />
            )}
            {this.state.visibleTab === 'Invoices' && (
              <Invoices />
            )}
            {this.state.visibleTab === 'POs' && (
              <PurchaseOrders />
            )}
            {this.state.visibleTab === 'Requisitions' && (
              <Requisitions />
            )}
          </TabContent>
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes Validation
Operations.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Operations);
