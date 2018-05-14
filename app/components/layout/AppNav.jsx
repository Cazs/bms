// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';

// Animation
import { Motion, spring } from 'react-motion';

const springConfig =
{
  stiffness: 350,
  damping: 18,
  precision: 0.01,
};

const setMarginValue = activeTab =>
{
  const multiplier = 100 / allTabs.length;
  const activeTabIndex = findIndex(allTabs, { name: activeTab });
  return activeTabIndex * multiplier;
};

const allTabs = [
  {
    title: 'Operations',
    name: 'operations',
    icon: 'ion-hammer', // ios-briefcase md-cog
  },
  {
    title: 'Safety',
    name: 'safety',
    icon: 'ion-clipboard',
  },
  {
    title: 'HR',
    name: 'hr',
    icon: 'ion-ios-body',
  },
  {
    title: 'Accounting',
    name: 'accounting',
    icon: 'ion-calculator',
  },
  {
    title: 'Timesheet',
    name: 'timesheet',
    icon: 'ion-clock',
  },
  {
    title: 'Settings',
    name: 'settings',
    icon: 'ion-ios-gear',
  },
  {
    title: 'Home',
    name: 'home',
    icon: 'ion-home',
  }
];

// Styles
import styled from 'styled-components';

export const SideBar = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 80px;
  min-width: 80px;
  max-width: 80px;
  background: #2c323a;
  margin-top: 43px;
  -webkit-box-shadow: 7px 0px 17px #3c3c3c;
`;

export const Tab = styled.a`
  position: relative;
  color: white;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1.5;
  text-decoration: none;
  height: 60px;
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

export const TabTitle = styled.div`
  position: absolute;
  margin-top: 20px;
  font-size: 9pt;
  text-align:center;
  font-weight:100;
  display:block;
`;

export const Icon = styled.i`
  ${props => props.id === 'operations' && `color: #40FF9A;`};
  ${props => props.id === 'safety' && `color: #469fe5;`};
  ${props => props.id === 'hr' && `color: #C4C8CC;`};
  ${props => props.id === 'accounting' && `color: #E84906;`};
  ${props => props.id === 'home' && `color: #cbc189;`};
  ${props => props.id === 'timesheet' && `color: #cbc189;`};
  ${props => props.id === 'settings' && `color: #cbc189;`};
`;

export const ActiveIndicator = styled.div`
  height: ${allTabs.length * 60}px;
  width: 5px;
  position: absolute;
  > div {
    position: absolute;
    background: #292b2c;
    width: 80px;
    border-left: 5px solid #469fe5;
    border-bottom: 1px solid #3e3e3e;
    border-top: 1px solid #3e3e3e;
  }
`;

// import AppUpdate from './AppUpdate';

function AppNav({ activeTab, changeTab })
{
  const marginTopValue = setMarginValue(activeTab);
  const allTabsComponent = allTabs.map(tab => (
    <Tab key={tab.name} href="#" onClick={() => changeTab(tab.name)}>
      <Icon id={tab.name} className={tab.icon} />
      <TabTitle>{tab.title}</TabTitle>
    </Tab>
  ));
  return (
    <SideBar>
      <div>
        <Motion style={{ marginTop: spring(marginTopValue, springConfig) }}>
          {({ marginTop }) => (
            <ActiveIndicator>
              <div
                style={{
                  height: `${100 / allTabs.length}%`,
                  top: `${marginTop}%`,
                }}
              />
            </ActiveIndicator>
          )}
        </Motion>
        {allTabsComponent}
      </div>
      {/* <AppUpdate /> */}
    </SideBar>
  );
}

AppNav.propTypes =
{
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
};

export default AppNav;
