// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { translate } from 'react-i18next';
const ipc = require('electron').ipcRenderer;

// Actions
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';

// Selectors
import { getEmployees } from '../reducers/HR/EmployeesReducer';
import { getMaterials } from '../reducers/Operations/MaterialsReducer';
import { getClients } from '../reducers/Operations/ClientsReducer';
import { getSuppliers } from '../reducers/Operations/SuppliersReducer';

// Styles
import styled from 'styled-components';

// Helpers
import * as SessionManager from '../helpers/SessionManager';
import Log, { formatDate } from '../helpers/Logger';
import * as GlobalConstants from '../constants/globals';

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

import Modal from 'react-modal';

// Selectors
// import { getQuotes } from '../reducers/QuotesReducer';

// Tab content Components
import Quotes from './Operations/Quotes';
import Jobs from './Operations/Jobs';
import Invoices from './Operations/Invoices';
import Requisitions from './Operations/Requisitions';
import PurchaseOrders from './Operations/PurchaseOrders';

const modalStyle =
{
  content :
  {
    top                   : '7%',
    left                  : '5%',
    right                 : 'auto',
    bottom                : 'auto',
    border                : '2px solid black',
    minWidth              : window.outerWidth-160, // '950px'
  }
};

// Component
class Operations extends Component
{
  constructor(props)
  {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.createClient = this.createClient.bind(this);
    this.createSupplier = this.createSupplier.bind(this);
    this.createMaterial = this.createMaterial.bind(this);

    this.state =
    {
      visibleTab: 'Quotes',

      is_new_client_modal_open: false,
      is_new_supplier_modal_open: false,
      is_new_material_modal_open: false,

      new_client: this.createClient(),
      new_supplier: this.createSupplier(),
      new_material: this.createMaterial()
    };
    this.header_actions = React.createRef();
  }

  createClient()
  {
    return {
      client_name: '',
      contact_email: '',
      physical_address: '',
      postal_address: '',
      tel: '',
      fax: '',
      registration_number: '',
      tax_number: '',
      account_name: '',
      partnered_date: '1970-01-01', // new Date(),
      date_partnered: 0, // new Date().getTime(),
      creator_name: SessionManager.session_usr.name,
      creator: SessionManager.session_usr.usr,
      creator_employee: SessionManager.session_usr,
      logged_date: formatDate(new Date()),
      date_logged: new Date().getTime()
    }
  }

  createSupplier()
  {
    return {
      supplier_name: '',
      contact_email: '',
      physical_address: '',
      postal_address: '',
      industry: '',
      tel: '',
      fax: '',
      registration_number: '',
      tax_number: '',
      account_name: '',
      partnered_date: '1970-01-01', // new Date(),
      date_partnered: 0, // new Date().getTime(),
      creator_name: SessionManager.session_usr.name,
      creator: SessionManager.session_usr.usr,
      creator_employee: SessionManager.session_usr,
      logged_date: formatDate(new Date()),
      date_logged: new Date().getTime()
    }
  }

  createMaterial()
  {
    const current_date = new Date();
                              
    return {
      brand_name: '',
      resource_description: '',
      resource_code: '',
      resource_type: 'hardware',
      resource_value: 0,
      quantity: 1,
      unit: 'ea',
      acquired_date: formatDate(current_date),
      date_acquired: current_date.getTime(),
      date_exhausted: 0,
      exhausted_date: '1970-01-01',
      supplier_id: '',
      part_number: '',
      creator_name: SessionManager.session_usr.name,
      creator: SessionManager.session_usr.usr,
      creator_employee: SessionManager.session_usr,
      logged_date: formatDate(current_date),
      date_logged: current_date.getTime()
    }
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

    const new_client_modal = 
    (
      <div>
        {/* New Client Modal */}
        <Modal
          isOpen={this.state.is_new_client_modal_open}
            // onAfterOpen={this.afterOpenModal}
            // onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="New Client"
        >
          <h2 ref={client_subtitle => this.client_subtitle = client_subtitle} style={{color: 'black'}}>Create New Client</h2>
          <div>
            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Client Name*</label>
                <input
                  ref={(txt_client_name)=>this.txt_client_name = txt_client_name}
                  name="client_name"
                  type="text"
                  value={this.state.new_client.client_name}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.client_name = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Tel No.*</label>
                <input
                  name="tel"
                  type="text"
                  ref={(txt_tel)=>this.txt_tel = txt_tel}
                  value={this.state.new_client.tel}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.tel = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">eMail*</label>
                <input
                  name="contact_email"
                  type='text'
                  ref={(txt_email)=>this.txt_email = txt_email}
                  value={this.state.new_client.contact_email}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.contact_email = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Fax</label>
                <input
                  name="fax"
                  type='text'
                  ref={(txt_fax)=>this.txt_fax = txt_fax}
                  value={this.state.new_client.fax}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.fax = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Physical Address*</label>
                <textarea
                  name="physical_address"
                  ref={(txt_physical_address)=>this.txt_physical_address = txt_physical_address}
                  value={this.state.new_client.physical_address}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.physical_address = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Postal Address*</label>
                <textarea
                  name="postal_address"
                  ref={(txt_postal_address)=>this.txt_postal_address = txt_postal_address}
                  value={this.state.new_client.postal_address}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.postal_address = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Tax Number</label>
                <input
                  name="tax_number"
                  type='text'
                  ref={(txt_tax_number)=>this.txt_tax_number = txt_tax_number}
                  value={this.state.new_client.tax_number}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.tax_number = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Registration Number</label>
                <input
                  name="registration_number"
                  type='text'
                  ref={(txt_registration_number)=>this.txt_registration_number = txt_registration_number}
                  value={this.state.new_client.registration_number}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.registration_number = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Website</label>
                <input
                  name="website"
                  type='text'
                  ref={(txt_website)=>this.txt_website = txt_website}
                  value={this.state.new_client.website}
                  onChange={(new_val)=>
                  {
                    const client = this.state.new_client;
                    client.website = new_val.currentTarget.value;
                    this.setState({new_client: client});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Date Partnered*</label>
                <input
                  type='date'
                  id="date_partnered"
                  name="date_partnered"
                  ref={(date_partnered)=>this.date_partnered=date_partnered}
                  defaultValue={this.state.new_client.date_partnered}
                  onChange={(new_val)=>
                  {
                    const date = new Date(new_val.currentTarget.value);
                    console.log('new client date_partnered in epoch millis: ', date.getTime());

                    const client = this.state.new_client;
                    client.date_partnered = date.getTime(); // current date in epoch milliseconds
                    client.partnered_date = date; // current date
                    this.setState({new_client: client});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <Button
                  onClick={(event)=>
                  {
                    if(!this.state.new_client.client_name) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid client name'
                        }
                      });
                    }

                    if(!this.state.new_client.tel) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid client telephone number'
                        }
                      });
                    }

                    if(!this.state.new_client.contact_email) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid client email address'
                        }
                      });
                    }

                    if(this.state.new_client.date_partnered <= 0) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid date partnered.'
                        }
                      });
                    }
                    // Prepare client object
                    const client = this.state.new_client;
                    client.object_number = this.props.clients.length;
                    client.account_name = client.client_name.toLowerCase().replace(' ', '-');
                    client.creator_name = SessionManager.session_usr.name;
                    client.creator = SessionManager.session_usr.usr;
                    client.creator_employee = SessionManager.session_usr;
                    client.date_logged = new Date().getTime();// current date in epoch millis
                    client.logged_date = formatDate(new Date()); // current date

                    this.setState({new_client: client, is_new_client_modal_open: false});

                    this.props.clients.push(this.state.new_client);
                    mapStateToProps(this.state);

                    // this.props.dispatch({
                    //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                    //   payload: {
                    //     type: 'success',
                    //     message: 'Successfully created new client',
                    //   },
                    // });

                    // dispatch action to create client on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.CLIENT_NEW,
                      payload: client
                    });

                    this.setState({new_client: this.createClient()});
                  }}
                  style={{width: '120px', height: '50px', float: 'right'}}
                  success
                >Create
                </Button>
              </div>

              <div className="pageItem col-md-6">
                <Button
                  danger
                  style={{width: '120px', height: '50px', float: 'left'}}
                  onClick={()=>this.setState({is_new_client_modal_open: false})}
                >Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>);

    const new_supplier_modal = 
    (
      <div>
        {/* New Supplier Modal */}
        <Modal
          isOpen={this.state.is_new_supplier_modal_open}
            // onAfterOpen={this.afterOpenModal}
            // onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="New Supplier"
        >
          <h2 ref={supplier_subtitle => this.supplier_subtitle = supplier_subtitle} style={{color: 'black'}}>Create New Supplier</h2>
          <div>
            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Supplier Name*</label>
                <input
                  ref={(txt_supplier_name)=>this.txt_supplier_name = txt_supplier_name}
                  name="supplier_name"
                  type="text"
                  value={this.state.new_supplier.supplier_name}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.supplier_name = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Tel No.*</label>
                <input
                  name="tel"
                  type="text"
                  ref={(txt_tel)=>this.txt_tel = txt_tel}
                  value={this.state.new_supplier.tel}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.tel = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">eMail*</label>
                <input
                  name="contact_email"
                  type='text'
                  ref={(txt_email)=>this.txt_email = txt_email}
                  value={this.state.new_supplier.contact_email}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.contact_email = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Fax</label>
                <input
                  name="fax"
                  type='text'
                  ref={(txt_fax)=>this.txt_fax = txt_fax}
                  value={this.state.new_supplier.fax}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.fax = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Physical Address*</label>
                <textarea
                  name="physical_address"
                  ref={(txt_physical_address)=>this.txt_physical_address = txt_physical_address}
                  value={this.state.new_supplier.physical_address}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.physical_address = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Postal Address*</label>
                <textarea
                  name="postal_address"
                  ref={(txt_postal_address)=>this.txt_postal_address = txt_postal_address}
                  value={this.state.new_supplier.postal_address}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.postal_address = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Tax Number</label>
                <input
                  name="tax_number"
                  type='text'
                  ref={(txt_tax_number)=>this.txt_tax_number = txt_tax_number}
                  value={this.state.new_supplier.tax_number}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.tax_number = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Registration Number</label>
                <input
                  name="registration_number"
                  type='text'
                  ref={(txt_registration_number)=>this.txt_registration_number = txt_registration_number}
                  value={this.state.new_supplier.registration_number}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.registration_number = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Website</label>
                <input
                  name="website"
                  type='text'
                  ref={(txt_website)=>this.txt_website = txt_website}
                  value={this.state.new_supplier.website}
                  onChange={(new_val)=>
                  {
                    const supplier = this.state.new_supplier;
                    supplier.website = new_val.currentTarget.value;
                    this.setState({new_supplier: supplier});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Date Partnered*</label>
                <input
                  type='date'
                  id="date_partnered"
                  name="date_partnered"
                  ref={(date_partnered)=>this.date_partnered=date_partnered}
                  defaultValue={this.state.new_supplier.date_partnered}
                  onChange={(new_val)=>
                  {
                    const date = new Date(new_val.currentTarget.value);
                    console.log('new supplier date_partnered in epoch millis: ', date.getTime());

                    const supplier = this.state.new_supplier;
                    supplier.date_partnered = date.getTime(); // current date in epoch milliseconds
                    supplier.partnered_date = date; // current date
                    this.setState({new_supplier: supplier});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <Button
                  onClick={(event)=>
                  {
                    if(!this.state.new_supplier.supplier_name) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid supplier name'
                        }
                      });
                    }

                    if(!this.state.new_supplier.tel) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid supplier telephone number'
                        }
                      });
                    }

                    if(!this.state.new_supplier.contact_email) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid supplier email address'
                        }
                      });
                    }

                    if(this.state.new_supplier.date_partnered <= 0) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid date partnered.'
                        }
                      });
                    }
                    // Prepare supplier object
                    const supplier = this.state.new_supplier;
                    supplier.object_number = this.props.suppliers.length;
                    supplier.account_name = supplier.supplier_name.toLowerCase().replace(' ', '-');
                    supplier.creator_name = SessionManager.session_usr.name;
                    supplier.creator = SessionManager.session_usr.usr;
                    supplier.creator_employee = SessionManager.session_usr;
                    supplier.date_logged = new Date().getTime();// current date in epoch millis
                    supplier.logged_date = formatDate(new Date()); // current date

                    this.setState({new_supplier: supplier, is_new_supplier_modal_open: false});

                    this.props.suppliers.push(this.state.new_supplier);
                    mapStateToProps(this.state);

                    // this.props.dispatch({
                    //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                    //   payload: {
                    //     type: 'success',
                    //     message: 'Successfully created new supplier',
                    //   },
                    // });

                    // dispatch action to create supplier on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.SUPPLIER_NEW,
                      payload: supplier
                    });

                    this.setState({new_supplier: this.createSupplier()});
                  }}
                  style={{width: '120px', height: '50px', float: 'right'}}
                  success
                >Create
                </Button>
              </div>

              <div className="pageItem col-md-6">
                <Button
                  danger
                  style={{width: '120px', height: '50px', float: 'left'}}
                  onClick={()=>this.setState({is_new_supplier_modal_open: false})}
                >Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>);

    const new_material_modal =
    (
      <div>
        {/* New Material Modal */}
        <Modal
          isOpen={this.state.is_new_material_modal_open}
            // onAfterOpen={this.afterOpenModal}
            // onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="New Material"
        >
          <h2 ref={material_subtitle => this.material_subtitle = material_subtitle} style={{color: 'black'}}>Create New Material</h2>
          <div>
            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Material Description*</label>
                <textarea
                  ref={(txt_material_name)=>this.txt_material_name = txt_material_name}
                  name="material_description"
                  value={this.state.new_material.resource_description}
                  onChange={(new_val)=>
                  {
                    const material = this.state.new_material;
                    material.resource_description = new_val.currentTarget.value;
                    this.setState({new_material: material});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px', width: '100%'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Material Cost (in {GlobalConstants.CURRENCY})*</label>
                <input
                  name="material_cost"
                  type="text"
                  ref={(txt_material_cost)=>this.txt_material_cost = txt_material_cost}
                  value={this.state.new_material.resource_value}
                  onChange={(new_val)=>
                  {
                    const material = this.state.new_material;
                    material.resource_value = new_val.currentTarget.value;
                    this.setState({new_material: material});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Category*</label>
                <input
                  name="material_category"
                  type='text'
                  ref={(txt_material_category)=>this.txt_material_category = txt_material_category}
                  value={this.state.new_material.resource_type}
                  onChange={(new_val)=>
                  {
                    const material = this.state.new_material;
                    material.resource_type = new_val.currentTarget.value;
                    this.setState({new_material: material});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Unit of measurement</label>
                <input
                  name="unit"
                  type='text'
                  ref={(txt_unit)=>this.txt_unit = txt_unit}
                  value={this.state.new_material.unit}
                  onChange={(new_val)=>
                  {
                    const material = this.state.new_material;
                    material.unit = new_val.currentTarget.value;
                    this.setState({new_material: material});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Quantity</label>
                <input
                  type='number'
                  name="quantity"
                  ref={(txt_quantity)=>this.txt_quantity = txt_quantity}
                  value={this.state.new_material.quantity}
                  onChange={(new_val)=>
                  {
                    const material = this.state.new_material;
                    material.quantity = new_val.currentTarget.value;
                    this.setState({new_material: material});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Date Acquired*</label>
                <input
                  type='date'
                  id="date_acquired"
                  name="date_acquired"
                  ref={(date_acquired)=>this.date_acquired=date_acquired}
                  defaultValue={this.state.new_material.acquired_date}
                  onChange={(new_val)=>
                  {
                    const date = new Date(new_val.currentTarget.value);
                    console.log('new material date_partnered in epoch millis: ', date.getTime());

                    const material = this.state.new_material;
                    material.date_acquired = date.getTime(); // current date in epoch milliseconds
                    material.acquired_date = date; // current date
                    this.setState({new_material: material});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <Button
                  onClick={(event)=>
                  {
                    if(!this.state.new_material.resource_description) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid material description'
                        }
                      });
                    }

                    if(this.state.new_material.resource_value <= 0) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid material cost'
                        }
                      });
                    }

                    if(!this.state.new_material.resource_type) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid material category'
                        }
                      });
                    }

                    if(!this.state.new_material.unit) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid material unit of measurement.'
                        }
                      });
                    }

                    if(this.state.new_material.quantity <= 0) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid material quantity'
                        }
                      });
                    }

                    if(this.state.new_material.date_acquired <= 0) // TODO: stricter validation
                    {
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid acquisition date.'
                        }
                      });
                    }

                    // Prepare material object
                    const material = Object.assign(this.state.new_material);
                    material.object_number = this.props.materials.length;
                    material.creator_name = SessionManager.session_usr.name;
                    material.creator = SessionManager.session_usr.usr;
                    material.creator_employee = SessionManager.session_usr;
                    material.date_logged = new Date().getTime();// current date in epoch millis
                    material.logged_date = formatDate(new Date()); // current date

                    this.props.materials.push(material);

                    this.setState(
                    {
                      // reset selected material
                      new_material: this.createMaterial(),
                      is_new_material_modal_open: false
                    });
                    
                    mapStateToProps(this.state);

                    // this.props.dispatch({
                    //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                    //   payload: {
                    //     type: 'success',
                    //     message: 'Successfully created new material',
                    //   },
                    // });

                    // dispatch action to create material on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.MATERIAL_NEW,
                      payload: material
                    });

                    // this.setState({new_material: this.createMaterial()});
                  }}
                  style={{width: '120px', height: '50px', float: 'right'}}
                  success
                >Create
                </Button>
              </div>

              <div className="pageItem col-md-6">
                <Button
                  danger
                  style={{width: '120px', height: '50px', float: 'left'}}
                  onClick={()=>this.setState({is_new_material_modal_open: false})}
                >Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>);

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Operations | {this.state.visibleTab}</PageHeaderTitle>
          <PageHeaderActions ref={this.header_actions}>
            <div style={{display: 'inline', float: 'right', marginTop: '-30px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
              {/* <Button primary>
                {t('common:save')}
              </Button> */}
              <Button
                primary
                onClick={()=>this.setState({is_new_client_modal_open: true})}
              >
                New Client
              </Button>
              <Button
                primary
                onClick={()=>this.setState({is_new_supplier_modal_open: true})}
              >
                New Supplier
              </Button>
              <Button
                primary
                onClick={()=>this.setState({is_new_material_modal_open: true})}
              >
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
          {new_client_modal}
          {new_supplier_modal}
          {new_material_modal}
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
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  clients: getClients(state),
  suppliers: getSuppliers(state),
  materials: getMaterials(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Operations);
