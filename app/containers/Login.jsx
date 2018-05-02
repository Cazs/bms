// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { translate } from 'react-i18next';

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';

// Helpers
import * as SessionManager from '../helpers/SessionManager';
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

    this.state = { };
  }

  login()
  {
    console.log('authenticating %s:%s', this.txt_username.value, this.txt_password.value);
    this.props.changeTab('home');
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
                <div className="pageItem col-md-6">
                  <label className="itemLabel" style={{color: '#fff'}}>Username</label>
                  <input
                    ref={(txt_username)=>this.txt_username = txt_username}
                    name="username"
                    type="text"
                    defaultValue={SessionManager.session_usr.usr}
                    // value={this.state.new_safety_document.document.filename}
                    // onChange={(new_val)=>
                    // {
                    //   const safety_document = this.state.new_safety_document;
                    //   safety_document.document.filename = new_val.currentTarget.value;
                    //   this.setState({new_safety_document: safety_document});
                    // }}
                    style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
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
                    style={{width: '250px', height: '35px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
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
