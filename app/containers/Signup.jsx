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
class Signup extends Component
{
  constructor(props)
  {
    super(props);
    this.signup = this.signup.bind(this);
    this.showLogin = this.showLogin.bind(this);

    this.state = 
    {
      new_employee:
      {
        usr: null,
        pwd: null,
        firstname: null,
        lastname: null,
        name: null,
        email: null,
        cell: null,
        access_level: 1 // TODO: start with 0 access level, change it when they've verified their email address.
      }
    };
  }

  showLogin()
  {
    this.props.changeTab('login');
  }

  signup()
  {
    console.log('creating account: ', this.state.new_employee);
    
    this.state.new_employee.name = this.state.new_employee.firstname + ' ' + this.state.new_employee.lastname;
    this.state.new_employee.initials = this.state.new_employee.firstname.charAt(0) + this.state.new_employee.lastname.charAt(0);
    this.state.new_employee.active = false;
    // TODO: bcrypt
    // Send signup request
    DataManager.putRemoteResource(this.props.dispatch, DataManager.db_employees, this.state.new_employee, '/employee', 'employees')
    .then(res =>
    {
      console.log('response data: ' + res);
      this.props.dispatch(
      {
        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
        payload:
        {
          type: 'success',
          message: 'Successfully created your account.'
        }
      });
      this.props.changeTab('login');
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

  // Render Main Content

  render()
  {
    const { t } = this.props;
    const home_button_style = {width: '450px', height: '190px', fontSize: '28pt'}

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Signup</PageHeaderTitle>
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
                <div className="pageItem col-md-6">
                  <label className="itemLabel" style={{color: '#fff'}}>Username</label>
                  <input
                    ref={(txt_username)=>this.txt_username = txt_username}
                    name="username"
                    type="text"
                    // defaultValue={sessionManager.getSessionUser().usr}
                    value={this.state.new_employee.usr}
                    onChange={(new_val)=>
                    {
                      const employee = this.state.new_employee;
                      employee.usr = new_val.currentTarget.value;
                      this.setState({new_employee: employee});
                    }}
                    style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel" style={{color: '#fff'}}>Password</label>
                  <input
                    ref={(txt_password)=>this.txt_password = txt_password}
                    name="password"
                    type="password"
                    value={this.state.new_employee.pwd}
                    onChange={(new_val)=>
                    {
                      const employee = this.state.new_employee;
                      employee.pwd = new_val.currentTarget.value;
                      this.setState({new_employee: employee});
                    }}
                    style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
                  <label className="itemLabel" style={{color: '#fff'}}>Firstname</label>
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
                  <label className="itemLabel" style={{color: '#fff'}}>Lastname</label>
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
                  <label className="itemLabel" style={{color: '#fff'}}>eMail Address</label>
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
                  <label className="itemLabel" style={{color: '#fff'}}>Cell No.</label>
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
                  <SignupButton
                    onClick={(evt)=>this.signup()}
                  >
                    Signup
                  </SignupButton>
                </div>
                <div className="pageItem col-md-6">
                  <LoginButton
                    onClick={(evt)=>this.showLogin()}
                  >
                    Login
                  </LoginButton>
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
Signup.propTypes =
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
)(Signup);
