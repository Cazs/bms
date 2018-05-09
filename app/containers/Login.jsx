// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { translate } from 'react-i18next';

// Actions
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';

// Helpers
import  * as DataManager from '../helpers/DataManager';
import sessionManager from '../helpers/SessionManager';
import Log from '../helpers/Logger';

// Ops
// import * as UserActions from './actions/hr/users';
import * as EmployeeActions from '../actions/hr/employees';
import * as ClientActions from '../actions/operations/clients';
import * as SupplierActions from '../actions/operations/suppliers';
import * as MaterialActions from '../actions/operations/materials';
import * as QuoteActions from '../actions/operations/quotes';
import * as JobActions from '../actions/operations/jobs';
import * as InvoiceActions from '../actions/operations/invoices';
import * as PurchaseOrderActions from '../actions/operations/purchase_orders';
import * as RequisitionActions from '../actions/operations/requisitions';

// HR
import * as LeaveApplicationActions from '../actions/hr/leave_applications';
import * as OvertimeApplicationActions from '../actions/hr/overtime_applications';

// Compliance
import * as ComplianceActions from '../actions/compliance/safety';

import
{
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../components/shared/Layout';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';

// Styles
import styled from 'styled-components';
const Profile = styled.div`
  float: left;
  width: 80px;
  height: 105%;
  background: url(../static/images/profile_minimal.png);
  background-size: contain;
  background-repeat: no-repeat;
  &:hover
  {
    background: url(../static/images/profile.png);
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

const LoginButton = styled.button`
  width: 150px;
  height: 50px;
  font-size: 18pt;
  background-color: rgba(0,255,0,.4);
  border: 1px solid #fff;
  border-radius: 3px;
  color: #fff;
  &:hover
  {
    background-color: rgba(0,200,0,1);
    color: #000;
  }
`;

const SignupButton = styled.button`
  width: 150px;
  height: 50px;
  font-size: 18pt;
  background-color: #46729C;
  border: 1px solid #fff;
  border-radius: 3px;
  color: #fff;
  &:hover
  {
    background-color: #72BAFF;
    color: #000;
  }
`;

// Component
class Login extends Component
{
  constructor(props)
  {
    super(props);
    this.login = this.login.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.initDataset = this.initDataset.bind(this);

    this.state = { };
  }

  showSignup()
  {
    this.props.changeTab('signup');
  }

  login()
  {
    console.log('authenticating %s:%s', this.txt_username.value, this.txt_password.value);

    // TODO: bcrypt
    // Send auth request
    DataManager.authenticate(this.props.dispatch, {username: this.txt_username.value, password: this.txt_password.value})
    .then(session_data =>
    {
      console.log('success, session data: ', session_data);

      sessionManager.setSessionId(session_data.session_id);
      sessionManager.setSessionDate(session_data.date);
      sessionManager.setSessionTtl(session_data.ttl);
      sessionManager.setSessionUser(session_data.employee);

      console.log('Session id: ', sessionManager.getSessionId());
      console.log('Session user: ', sessionManager.getSessionUser());

      this.props.dispatch(
      {
        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
        payload:
        {
          type: 'success',
          message: session_data.employee.access_level > 2 ? '*Granted super user access rights. Welcome, ' + sessionManager.getSessionUser().firstname + '.'
                    :'Successfully signed in. Welcome, ' + sessionManager.getSessionUser().firstname + '.'
        }
      });
      this.initDataset();
      this.props.changeTab('home');
    })
    .catch(err =>
    {
      console.log('error: ', err);
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
  }

  initDataset()
  {
    const { dispatch } = this.props;

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
  }

  // Render Main Content

  render()
  {
    const { t } = this.props;
    const home_button_style = {width: '450px', height: '190px', fontSize: '28pt'}

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Login</PageHeaderTitle>
          <PageHeaderActions ref={this.header_actions}>
            {/* <div style={{display: 'inline', float: 'right', marginTop: '-30px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
            </div> */}
          </PageHeaderActions>
        </PageHeader>
        <PageContent>
          <div style={{background:'rgba(0,0,0,.4)', height: '100%', marginTop: '-20px'}}>
            <div style={{padding: '20px', width: '34%', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto'}}>
              <div style={{
                  width: '400px',
                  height: '120px',
                  float: 'right',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  // marginTop: '-67px',
                  background: 'url(../static/images/logo.svg)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
            <div style={{
                padding: '20px',
                width: '40%',
                marginTop: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: '10px',
                border: '1px solid #000',
                backgroundColor: '#383833',
                boxShadow: '-5px 5px 30px #343434'
              }}
            >
              <div className='row'>
                <div className="pageItem col-md-12">
                  <label className="itemLabel" style={{color: '#fff'}}>Username</label>
                  <input
                    ref={(txt_username)=>this.txt_username = txt_username}
                    name="username"
                    type="text"
                    // defaultValue={SessionManager.getSessionUser().usr}
                    // value={this.state.new_safety_document.document.filename}
                    // onChange={(new_val)=>
                    // {
                    //   const safety_document = this.state.new_safety_document;
                    //   safety_document.document.filename = new_val.currentTarget.value;
                    //   this.setState({new_safety_document: safety_document});
                    // }}
                    style={{width: '100%', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-12">
                  <label className="itemLabel" style={{color: '#fff'}}>Password</label>
                  <input
                    ref={(txt_password)=>this.txt_password = txt_password}
                    name="password"
                    type="password"
                    // value={this.state.new_safety_document.document.filename}
                    // onChange={(new_val)=>
                    // {
                    //   const safety_document = this.state.new_safety_document;
                    //   safety_document.document.filename = new_val.currentTarget.value;
                    //   this.setState({new_safety_document: safety_document});
                    // }}
                    style={{width: '100%', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
                  <LoginButton
                    onClick={(evt)=>this.login()}
                  >
                    Login
                  </LoginButton>
                </div>
                <div className="pageItem col-md-6">
                  <SignupButton
                    onClick={(evt)=>this.showSignup()}
                    style={{float: 'right'}}
                  >
                      Signup
                  </SignupButton>
                </div>
              </div>
            </div>
          </div>
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes Validation
Login.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

// Map state to props & Export
const mapStateToProps = state => (
{
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Login);
