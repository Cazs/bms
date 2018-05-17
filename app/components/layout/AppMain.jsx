// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Login from '../../containers/Login';
import Signup from '../../containers/Signup';
import Home from '../../containers/Home';
import Operations from '../../containers/Operations';
import HR from '../../containers/HR';
import Safety from '../../containers/Compliance';
import Settings from '../../containers/Settings';

// Layout
import { AppMainContent } from '../shared/Layout';

class AppMain extends Component
{
  shouldComponentUpdate(nextProps)
  {
    return this.props.activeTab !== nextProps.activeTab;
  }

  render()
  {
    const { activeTab } = this.props;    
    return (
      <AppMainContent>
        {activeTab === 'signup' && <Signup changeTab={this.props.changeTab} setLoading={this.props.setLoading} />}
        {activeTab === 'login' && <Login changeTab={this.props.changeTab} setLoading={this.props.setLoading} />}
        {activeTab === 'home' && <Home changeTab={this.props.changeTab} setLoading={this.props.setLoading} />}
        {activeTab === 'operations' && <Operations setLoading={this.props.setLoading} />}
        {activeTab === 'hr' && <HR setLoading={this.props.setLoading} />}
        {activeTab === 'safety' && <Safety setLoading={this.props.setLoading} />}
        {activeTab === 'settings' && <Settings setLoading={this.props.setLoading} />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes =
{
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired
};

export default AppMain;
