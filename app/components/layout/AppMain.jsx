// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
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
        {activeTab === 'operations' && <Operations />}
        {activeTab === 'hr' && <HR />}
        {activeTab === 'safety' && <Safety />}
        {activeTab === 'settings' && <Settings />}
      </AppMainContent>
    );
  }
}

AppMain.propTypes =
{
  activeTab: PropTypes.string.isRequired,
};

export default AppMain;
