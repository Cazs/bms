// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

// Actions
import * as ACTION_TYPES from '../constants/actions.jsx';
import * as UIActions from '../actions/ui';

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';
import LoginButton from '../components/shared/LoginButton';
import SignupButton from '../components/shared/SignupButton';

// Helpers
import  * as DataManager from '../helpers/DataManager';
import sessionManager from '../helpers/SessionManager';
import Log from '../helpers/Logger';

// Ops
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

// Component
class Login extends Component
{
  constructor(props)
  {
    super(props);
    this.login = this.login.bind(this);
    this.showSignup = this.showSignup.bind(this);
    this.initDataset = this.initDataset.bind(this);
  }

  componentDidMount()
  {
    this.txt_username.focus();
  }

  showSignup()
  {
    this.props.changeTab('signup');
  }



  login()
  {
    this.props.setLoading(true);
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
      this.props.setLoading(false);
    })
    .catch(err =>
    {
      console.log('error: ', err);
      this.props.setLoading(false);
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

    // Get Operational data
    dispatch(ClientActions.getClients());
    dispatch(SupplierActions.getSuppliers());
    dispatch(MaterialActions.getMaterials());
    dispatch(QuoteActions.getQuotes());
    dispatch(JobActions.getJobs());
    // dispatch(JobActions.getQuickJobs());
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
          <div style={{height: '100%', marginTop: '0px', top: '0px'}}>
            <div style={{
                padding: '20px',
                width: '40%',
                marginTop: '250px',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: '10px',
                border: '1px solid #000',
                backgroundColor: '#383833',
                boxShadow: '-5px 5px 30px #343434'
              }}
            >
              <div style={{
                // position: 'fixed',
                width: '100%',
                height: '180px',
                // float: 'right',
                marginTop: '-180px',
                // marginRight: 'auto',
                // marginLeft: 'auto',
                // marginTop: '-67px',
                background: 'url(../static/images/logo.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
              />
              <div
                className='row'
                style={{marginTop: '20px'}}
              >
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
                    onKeyPress={(evt)=>
                    {
                      if(evt.key === 'Enter')
                      {
                        this.login();
                      }
                    }}
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
                    style={{width: '100%', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                    onKeyPress={(evt)=>
                      {
                        if(evt.key === 'Enter')
                        {
                          this.login();
                        }
                      }}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
                  <LoginButton
                    style={{width: '200px', height: '85px'}}
                    onClick={(evt)=>this.login()}
                  >
                    Login
                  </LoginButton>
                </div>
                <div className="pageItem col-md-6">
                  <p style={{textAlign: 'right', color: '#fff'}}>Don't have an account?</p>
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
  setLoading: PropTypes.func.isRequired,
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
