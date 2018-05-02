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

const HomeButton = styled.button`
  width: 450px;
  height: 170px;
  font-size: 28pt;
  background-color: #46729C;
  border-radius: 5px;
  color: #fff;
  border: 1px solid #fff;
  &:hover
  {
    background-color: #72BAFF;
    color: #000;
    border: 1px solid #ff7400;
  }
`;


// Component
class Home extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { };
  }

  // Render Main Content

  render()
  {
    const { t } = this.props;
    const home_button_style = {width: '450px', height: '190px', fontSize: '28pt'}

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>Home</PageHeaderTitle>
          <PageHeaderActions ref={this.header_actions}>
            {/* <div style={{display: 'inline', float: 'right', marginTop: '-30px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
            </div> */}
          </PageHeaderActions>
        </PageHeader>
        <PageContent>
          {/* <div style={{position: 'fixed', width: '100%', height: '140px', top: '0px', left: '0px', background: 'rgba(0,0,0,.5)', zIndex: '150'}} /> */}
          <div style={{backgroundColor: 'rgba(0,0,0,.4)', marginTop: '-90px'}}>
            {/* Nav Bar */}
            <div
              style={{
                position: 'fixed',
                width: '100%',
                height: '80px',
                left: '0px',
                top: '45px',
                backgroundColor: 'rgba(0,0,0,.6)',
                borderBottom: '1px solid #000',
                zIndex: 100
              }}
            >
              <div className='row'>
                <div className="pageItem col-md-4">
                  <Profile
                    style={{marginTop: '0px'}}
                    // onClick={()=>this.setState({profile_menu_visible: !this.state.profile_menu_visible})}
                  />
                  <label style={{fontSize: '26pt', marginLeft: '30px', marginTop: '15px', float: 'left', color: '#fff'}}>{SessionManager.session_usr.name}</label>
                </div>
                <div className="pageItem col-md-4">
                  <p style={{fontSize: '26pt', float: 'right', color: '#fff'}}>Enterprise Resource Engine</p>
                </div>
                <div className="pageItem col-md-4">
                  <div style={{
                    width: '200px',
                    height: '120px',
                    float: 'right',
                    marginRight: '40px',
                    // marginTop: '-67px',
                    background: 'url(../static/images/logo.svg)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                  />
                </div>
              </div>
            </div>

            <div style={{margin: '20px', width: '80%', paddingTop: '200px', marginLeft: 'auto', marginRight: 'auto'}}>
              <div className='row'>
                <div className="pageItem col-md-6">
                  <HomeButton
                    onClick={(evt)=>this.props.changeTab('operations')}
                  >
                    Operations
                  </HomeButton>
                </div>
                <div className="pageItem col-md-6">
                  <HomeButton
                    // primary
                    // style={home_button_style}
                    onClick={(evt)=>this.props.changeTab('hr')}
                  >
                  HR
                  </HomeButton>
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
                  <HomeButton
                    // primary
                    // style={home_button_style}
                    onClick={(evt)=>this.props.changeTab('safety')}
                  >
                  Safety
                  </HomeButton>
                </div>
                <div className="pageItem col-md-6">
                  <HomeButton
                    // primary
                    // style={home_button_style}
                    onClick={(evt)=>this.props.changeTab('accounting')}
                  >
                  Accounting
                  </HomeButton>
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-md-6">
                  <HomeButton
                    // primary
                    // style={home_button_style}
                    onClick={(evt)=>this.props.changeTab('timesheets')}
                  >
                  Timesheets
                  </HomeButton>
                </div>
                <div className="pageItem col-md-6">
                  <HomeButton
                    // primary
                    // style={home_button_style}
                    onClick={(evt)=>this.props.changeTab('settings')}
                  >
                  Settings
                  </HomeButton>
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
Home.propTypes =
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
)(Home);
