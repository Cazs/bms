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
import  * as DataManager from '../helpers/DataManager';
import sessionManager from '../helpers/SessionManager';
import Log, { formatDate } from '../helpers/Logger';
import * as GlobalConstants from '../constants/globals';
import Material from '../helpers/Material';

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';
import LoginButton from '../components/shared/LoginButton';
import SignupButton from '../components/shared/SignupButton';
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
    this.newEmployee = this.newEmployee.bind(this);
    this.showEmailModal = this.showEmailModal.bind(this);

    this.state =
    {
      visibleTab: 'Quotes',

      is_new_client_modal_open: false,
      is_email_modal_open: false,
      is_new_supplier_modal_open: false,
      is_new_material_modal_open: false,
      is_new_contact_modal_open: false,

      new_employee: this.newEmployee(),
      new_client: this.createClient(),
      new_supplier: this.createSupplier(),
      new_material: Material(),

      new_email:
      {
        document_id: null,
        destination: '',
        subject: '',
        message: '',
        path: null,
        file: null,
        // raw_data: null
      }
    };
  }

  newEmployee()
  {
    return {
      usr: null,
      pwd: null,
      firstname: null,
      lastname: null,
      name: null,
      email: null,
      cell: null,
      access_level: 0 // no-access users, i.e. external contacts
    }
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
      creator_name: sessionManager.getSessionUser().name,
      creator: sessionManager.getSessionUser().usr,
      creator_employee: sessionManager.getSessionUser(),
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
      creator_name: sessionManager.getSessionUser().name,
      creator: sessionManager.getSessionUser().usr,
      creator_employee: sessionManager.getSessionUser(),
      logged_date: formatDate(new Date()),
      date_logged: new Date().getTime()
    }
  }

  componentDidMount()
  {
    // Add Event Listener
    ipc.on('change-operations-tab', (event, tab_num) =>
    {
      this.changeTab(tab_num);
    });

    // TODO: check if removed listeners on close
    ipc.on('email-document-ready', (event, doc_id, doc_path) =>
    {
      console.log(doc_path);
      this.setState({new_email: Object.assign(this.state.new_email, {document_id: doc_id, path: doc_path})});
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

  showEmailModal()
  {
    this.setState(
    {
      is_email_modal_open: true,
      // new_email: Object.assign(this.state.new_email, {raw_data: obj})
    });
  }

  // Render Main Content

  render()
  {
    const { t } = this.props;
    const { quotes } = this.props;

    const new_contact_modal = 
    (
      <div>
        {/* New Contact Modal */}
        <Modal
          isOpen={this.state.is_new_contact_modal_open}
            // onAfterOpen={this.afterOpenModal}
            // onRequestClose={this.closeModal}
          style={{
            content :
            {
              position: 'fixed',
              top     : '20%',
              left    : '14%',
              right   : 'auto',
              bottom  : 'auto',
              border  : '2px solid black',
              minWidth: window.outerWidth-300, // '950px'
            }
          }}
          contentLabel="New Contact"
        >
          <h2 ref={supplier_subtitle => this.supplier_subtitle = supplier_subtitle} style={{color: 'black'}}>Create New Contact</h2>
          <div>
            <div className='row'>
              <div className="pageItem col-md-6">
                <label className="itemLabel" style={{color: '#000'}}>Firstname</label>
                <input
                  ref={(txt_firstname)=>this.txt_firstname = txt_firstname}
                  name="firstname"
                  type="text"
                  value={this.state.new_employee.firstname}
                  onChange={(new_val)=>
                  {
                    const employee = this.state.new_employee;
                    employee.firstname = new_val.currentTarget.value;
                    this.setState({new_employee: employee});
                  }}
                  style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel" style={{color: '#000'}}>Lastname</label>
                <input
                  ref={(txt_lastname)=>this.txt_lastname = txt_lastname}
                  name="lastname"
                  type="text"
                  value={this.state.new_employee.lastname}
                  onChange={(new_val)=>
                  {
                    const employee = this.state.new_employee;
                    employee.lastname = new_val.currentTarget.value;
                    this.setState({new_employee: employee});
                  }}
                  style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className='row'>
              <div className="pageItem col-md-6">
                <label className="itemLabel" style={{color: '#000'}}>eMail&nbsp;Address</label>
                <input
                  ref={(txt_email)=>this.txt_email = txt_email}
                  name="email"
                  type="email"
                  value={this.state.new_employee.email}
                  onChange={(new_val)=>
                  {
                    const employee = this.state.new_employee;
                    employee.email = new_val.currentTarget.value;
                    this.setState({new_employee: employee});
                  }}
                  style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel" style={{color: '#000'}}>Cell No.</label>
                <input
                  ref={(txt_cell)=>this.txt_cell = txt_cell}
                  name="cell"
                  type="text"
                  value={this.state.new_employee.cell}
                  onChange={(new_val)=>
                  {
                    const employee = this.state.new_employee;
                    employee.cell = new_val.currentTarget.value;
                    this.setState({new_employee: employee});
                  }}
                  style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className='row'>
              <div className="pageItem col-md-6">
                <LoginButton
                  onClick={(evt)=>
                  {
                    if(sessionManager.getSessionUser().access_level < GlobalConstants.ACCESS_LEVELS[1].level) // no access and less are not allowed
                      return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to create contacts.'));

                    this.props.setLoading(true);
                    this.setState({is_new_contact_modal_open: false});

                    console.log('creating account: ', this.state.new_employee);

                    if(!this.state.new_employee.firstname || this.state.new_employee.firstname.length <= 1)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_contact_modal_open: true});
                      return this.props.dispatch(UIActions.newNotification('danger', 'Invalid contact firstname.'));
                    }

                    if(!this.state.new_employee.lastname || this.state.new_employee.lastname.length <= 1)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_contact_modal_open: true});
                      return this.props.dispatch(UIActions.newNotification('danger', 'Invalid contact lastname.'));
                    }

                    if(!this.state.new_employee.email || this.state.new_employee.email.length <= 1 ||
                       !this.state.new_employee.email.includes('@') || !this.state.new_employee.email.includes('\.'))
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_contact_modal_open: true});
                      return this.props.dispatch(UIActions.newNotification('danger', 'Invalid contact email address.'));
                    }

                    if(!this.state.new_employee.cell || this.state.new_employee.cell.length <= 9)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_contact_modal_open: true});
                      return this.props.dispatch(UIActions.newNotification('danger', 'Invalid cellphone number.'));
                    }

                    this.state.new_employee.usr = this.state.new_employee.email;
                    this.state.new_employee.pwd = this.state.new_employee.cell; // TODO: bcrypt
                    this.state.new_employee.name = this.state.new_employee.firstname + ' ' + this.state.new_employee.lastname;
                    this.state.new_employee.initials = this.state.new_employee.firstname.charAt(0) + this.state.new_employee.lastname.charAt(0);
                    this.state.new_employee.active = false;
                    this.state.new_employee.access_level = 0;
                    this.state.new_employee.status = 3; // marks employee as external contact

                    const context = this;
                    
                    // Send signup request
                    DataManager.putRemoteResource(this.props.dispatch, DataManager.db_employees, this.state.new_employee, '/employee', 'employees')
                    .then(res =>
                    {
                      console.log('response data: ' + res);
                      this.props.setLoading(false);
                      this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload:
                        {
                          type: 'success',
                          message: 'Successfully created new contact.'
                        }
                      });
                      const new_employee = Object.assign(context.state.new_employee, {_id: res}); // w/ _id
                      context.props.employees.push(new_employee);
                      context.setState({new_employee: context.newEmployee(), is_new_contact_modal_open: false});
                    })
                    .catch(err =>
                    {
                      console.log('error: ', err);
                      this.props.setLoading(false);
                      this.setState({is_new_contact_modal_open: true});
                      this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload:
                        {
                          type: 'danger',
                          message: err.message
                        }
                      });
                    });
                  }}
                >
                  Create
                </LoginButton>
              </div>
              <div className="pageItem col-md-6">
                <SignupButton
                  onClick={(evt)=>this.setState({is_new_contact_modal_open: false})}
                >
                  Dismiss
                </SignupButton>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );

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
                <label className="itemLabel">Tax Number*</label>
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
                <label className="itemLabel">Registration Number*</label>
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
                    if(sessionManager.getSessionUser().access_level < GlobalConstants.ACCESS_LEVELS[1].level) // no access and less are not allowed
                      return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to create clients.'));

                    this.props.setLoading(true);
                    this.setState({is_new_client_modal_open: false});

                    if(!this.state.new_client.client_name || this.state.new_client.client_name.length <= 1) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
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

                    if(!this.state.new_client.tel || this.state.new_client.tel.length <= 9) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
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

                    if(!this.state.new_client.contact_email || this.state.new_client.contact_email.length <= 1 ||
                       !this.state.new_client.contact_email.includes('@') || !this.state.new_client.contact_email.includes('\.'))
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
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

                    if(!this.state.new_client.tax_number || this.state.new_client.tax_number.length <= 3)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid client tax number'
                        }
                      });
                    }

                    if(!this.state.new_client.registration_number || this.state.new_client.registration_number.length <= 3)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid client registration number'
                        }
                      });
                    }

                    if(this.state.new_client.date_partnered <= 0 || this.state.new_client.date_partnered > new Date().getTime())
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_client_modal_open: true});
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
                    client.creator_name = sessionManager.getSessionUser().name;
                    client.creator = sessionManager.getSessionUser().usr;
                    client.creator_employee = sessionManager.getSessionUser();
                    client.date_logged = new Date().getTime();// current date in epoch millis
                    client.logged_date = formatDate(new Date()); // current date

                    // mapStateToProps(this.state);

                    const context = this;

                    // dispatch action to create client on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.CLIENT_NEW,
                      payload: client,
                      callback(new_client)
                      {
                        context.props.clients.push(new_client);
                        context.setState({new_client: client, is_new_client_modal_open: false});
                        context.props.setLoading(false);
                      }
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
      </div>
    );

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
                    if(sessionManager.getSessionUser().access_level < GlobalConstants.ACCESS_LEVELS[1].level) // no access and less are not allowed
                      return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to create suppliers.'));

                    this.props.setLoading(true);
                    this.setState({is_new_supplier_modal_open: false});

                    if(!this.state.new_supplier.supplier_name || this.state.new_supplier.supplier_name.length <= 1)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
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

                    if(!this.state.new_supplier.tel || this.state.new_supplier.tel.length <= 9)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
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

                    if(!this.state.new_supplier.contact_email || this.state.new_supplier.contact_email.length <= 1 ||
                      !this.state.new_supplier.contact_email.includes('@') || !this.state.new_supplier.contact_email.includes('\.'))
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
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

                    if(!this.state.new_supplier.tax_number || this.state.new_supplier.tax_number.length <= 3)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid supplier tax number'
                        }
                      });
                    }

                    if(!this.state.new_supplier.registration_number || this.state.new_supplier.registration_number.length <= 3)
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid supplier registration number'
                        }
                      });
                    }

                    if(this.state.new_supplier.date_partnered <= 0 || this.state.new_supplier.date_partnered > new Date().getTime()) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_supplier_modal_open: true});
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
                    supplier.creator_name = sessionManager.getSessionUser().name;
                    supplier.creator = sessionManager.getSessionUser().usr;
                    supplier.creator_employee = sessionManager.getSessionUser();
                    supplier.date_logged = new Date().getTime();// current date in epoch millis
                    supplier.logged_date = formatDate(new Date()); // current date

                    // mapStateToProps(this.state);

                    const context = this;

                    // dispatch action to create supplier on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.SUPPLIER_NEW,
                      payload: supplier,
                      callback(new_supplier)
                      {
                        context.props.suppliers.push(new_supplier);
                        context.setState({new_supplier, is_new_supplier_modal_open: false});
                        context.props.setLoading(false);
                      }
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
      </div>
    );

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
                    if(sessionManager.getSessionUser().access_level < GlobalConstants.ACCESS_LEVELS[1].level) // no access and less are not allowed
                      return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to create materials.'));

                    this.props.setLoading(true);
                    this.setState({is_new_material_modal_open: false});

                    if(!this.state.new_material.resource_description) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                      this.props.setLoading(false);
                      this.setState({is_new_material_modal_open: true});
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
                    material.creator_name = sessionManager.getSessionUser().name;
                    material.creator = sessionManager.getSessionUser().usr;
                    material.creator_employee = sessionManager.getSessionUser();
                    material.date_logged = new Date().getTime();// current date in epoch millis
                    material.logged_date = formatDate(new Date()); // current date
                    
                    // mapStateToProps(this.state);
                    const context = this;
                    // dispatch action to create material on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.MATERIAL_NEW,
                      payload: material,
                      callback(new_material)
                      {
                        context.props.materials.push(new_material);
                        context.setState({new_material, is_new_material_modal_open: false});
                        context.props.setLoading(false);
                      }
                    });

                    this.setState(
                    {
                      // reset selected material
                      new_material: Material()
                    });
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
      </div>
    );

    const email_modal =
    (
      <div>
        {/* eMailing Modal */}
        <Modal
          isOpen={this.state.is_email_modal_open}
            // onAfterOpen={this.afterOpenModal}
            // onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="Compose eMail"
        >
          <h2 ref={email_subtitle => this.email_subtitle = email_subtitle} style={{color: 'black'}}>Compose eMail</h2>
          <div>
            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">eMail Address</label>
                <input
                  ref={(txt_email_address)=>this.txt_email_address = txt_email_address}
                  name="email_address"
                  type="text"
                  value={this.state.new_email.destination}
                  onChange={(new_val)=>
                  {
                    const email = this.state.new_email;
                    email.destination = new_val.currentTarget.value;
                    this.setState({new_email: email});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>

              <div className="pageItem col-md-6">
                <label className="itemLabel">Subject</label>
                <input
                  name="subject"
                  type="text"
                  ref={(txt_subject)=>this.txt_subject = txt_subject}
                  value={this.state.new_email.subject}
                  onChange={(new_val)=>
                  {
                    const email = this.state.new_email;
                    email.subject = new_val.currentTarget.value;
                    this.setState({new_email: email});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <label className="itemLabel">Message</label>
                <textarea
                  name="message"
                  ref={(txt_message)=>this.txt_message = txt_message}
                  value={this.state.new_email.message}
                  onChange={(new_val)=>
                  {
                    const email = this.state.new_email;
                    email.message = new_val.currentTarget.value;
                    this.setState({new_email: email});
                  }}
                  style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row">
              <div className="pageItem col-md-6">
                <Button
                  onClick={(event)=>
                  {
                    if(sessionManager.getSessionUser().access_level < GlobalConstants.ACCESS_LEVELS[1].level) // no access and less are not allowed
                      return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to send emails.'));

                    this.props.setLoading(true);
                    this.setState({is_email_modal_open: false});

                    if(!this.state.new_email.destination || this.state.new_email.destination.length <= 1 ||
                      !this.state.new_email.destination.includes('@') || !this.state.new_email.destination.includes('\.'))
                    {
                      this.props.setLoading(false);
                      this.setState({is_email_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid destination email address'
                        }
                      });
                    }

                    if(!this.state.new_email.subject) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_email_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid email subject'
                        }
                      });
                    }

                    if(!this.state.new_email.message) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_email_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid email message'
                        }
                      });
                    }

                    if(!this.state.new_email.path) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_email_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'warning',
                          message: 'Document is not yet ready.'
                        }
                      });
                    }

                    if(!this.state.new_email.document_id) // TODO: stricter validation
                    {
                      this.props.setLoading(false);
                      this.setState({is_email_modal_open: true});
                      return this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: 
                        {
                          type: 'danger',
                          message: 'Invalid document id.'
                        }
                      });
                    }
                    
                    // Prepare eMail
                    // const appConfig = require('electron-settings');
                    // const path = require('path');
                    const fs = require('fs');
                    // const exportDir = appConfig.get('invoice.exportDir');
                    // const pdfPath = path.join(this.state.new_email.path, `${this.state.document_id}.pdf`);

                    const file_data = fs.readFileSync(this.state.new_email.path);
                    const file_base64_str = `data:application/pdf;base64,${file_data.toString('base64')}`;

                    // console.log('file_data: ', file_data);

                    const file =
                    {
                      filename: this.state.new_email.document_id,
                      content_type: 'application/pdf',
                      file: file_data.toString('base64') // file_base64_str.split('base64,').pop()
                    }

                    const { HttpClient, SERVER_IP, SERVER_PORT } = require('../helpers/HttpClient');

                    const headers = 
                    {
                      document_id: this.state.new_email.document_id,
                      destination: this.state.new_email.destination,
                      subject: this.state.new_email.subject,
                      message : this.state.new_email.message,
                      session_id : sessionManager.session_id,
                      'Content-Type': 'application/json'
                    }

                    return HttpClient.post('http://' + SERVER_IP + ':' + SERVER_PORT + '/mailto', file, { headers })
                                      .then(response =>
                                      {
                                        this.props.setLoading(false);
                                        if(response)
                                        {
                                          if(response.status == 200) // Success, successfully emailed document
                                          {
                                            console.log('Successfully emailed document.');
                                            this.setState({is_email_modal_open: false});
                                            return this.props.dispatch(UIActions.newNotification('success', 'Successfully emailed document.'));
                                          } 
                                          console.log('Error: ' + response.status);
                                          return this.props.dispatch(UIActions.newNotification('danger', 'Error ['+response.status+']: ' + (response.statusText || response.data)));
                                        }
                                        console.log('Error: Could not get a valid response from the server.');
                                        return this.props.dispatch(UIActions.newNotification('danger', 'Error: Could not get a valid response from the server.'));
                                      })
                                      .catch(err =>
                                      {
                                        console.log('Error: ', err);
                                        this.props.setLoading(false);
                                        this.setState({is_email_modal_open: true});
                                        return this.props.dispatch(UIActions.newNotification('danger', err.message));
                                      });

                  }}
                  style={{width: '120px', height: '50px', float: 'right'}}
                  success
                >Send
                </Button>
              </div>

              <div className="pageItem col-md-6">
                <Button
                  danger
                  style={{width: '120px', height: '50px', float: 'left'}}
                  onClick={()=>this.setState({is_email_modal_open: false})}
                >Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Operations | {this.state.visibleTab}</PageHeaderTitle>
          <PageHeaderActions>
            {/* <div style={{display: 'inline', float: 'right', marginTop: '2px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
              {/* <Button primary>
                {t('common:save')}
              </Button> *}
              <Button
                primary
                onClick={()=>this.setState({is_new_contact_modal_open: true})}
              >
                New Contact
              </Button>
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
            </div> */}
          </PageHeaderActions>
          <Tabs style={{width: '100%', borderTop: '2px solid black', marginTop: '0px', zIndex: '90'}}>
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
            <div style={{display: 'inline', float: 'right', marginTop: '5px', paddingLeft: '50px', borderBottom: '2px', borderColor: 'black', width: 'auto'}}>
              {/* <Button primary>
                {t('common:save')}
              </Button> */}
              <Button
                primary
                onClick={()=>
                {
                  this.props.setLoading(true);
                  this.setState({is_new_contact_modal_open: true})
                }}
              >
                New Contact
              </Button>
              <Button
                primary
                style={{marginLeft: '5px'}}
                onClick={()=>this.setState({is_new_client_modal_open: true})}
              >
                New Client
              </Button>
              <Button
                primary
                style={{marginLeft: '5px'}}
                onClick={()=>this.setState({is_new_supplier_modal_open: true})}
              >
                New Supplier
              </Button>
              <Button
                primary
                style={{marginLeft: '5px'}}
                onClick={()=>this.setState({is_new_material_modal_open: true})}
              >
                New Stock Item
              </Button>
            </div>
          </Tabs>
        </PageHeader>
        <PageContent>
          {email_modal}
          {new_contact_modal}
          {new_client_modal}
          {new_supplier_modal}
          {new_material_modal}
          <TabContent>
            {this.state.visibleTab === 'Quotes' && (
              // <Profile t={t} />
              <Quotes showEmailModal={()=>this.showEmailModal()} />
            )}
            {this.state.visibleTab === 'Jobs' && (
              <Jobs showEmailModal={()=>this.showEmailModal()} />
            )}
            {this.state.visibleTab === 'Invoices' && (
              <Invoices showEmailModal={()=>this.showEmailModal()} />
            )}
            {this.state.visibleTab === 'POs' && (
              <PurchaseOrders showEmailModal={()=>this.showEmailModal()} />
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
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state =>
({
  employees: getEmployees(state),
  clients: getClients(state),
  suppliers: getSuppliers(state),
  materials: getMaterials(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Operations);
