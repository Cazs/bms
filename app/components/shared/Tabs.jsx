// Libraries
import React from 'react';

// Styles
import styled from 'styled-components';

const TabsStyle = styled.div`
  display: flex;
  justify-content: flex-start;
  border-top: 1px solid rgba(0,0,0,.6);
  border-bottom: 1px solid rgba(0,0,0,.4);
  box-shadow: 0px 0px 9px #3c3c3c;
`;

const TabStyle = styled.a`
  min-width: 100px;
  tex-align: center;
  background: #f9fbfa;
  text-decoration: none;
  color: #292b2c;
  font-weight: 400;
  font-size: 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  &:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  &.active {
    background: #fff;
    border-bottom: 2px solid rgba(10, 200, 30, .7);
  }
  &:hover {
    background: rgba(0, 0, 0, .3);
    border-bottom: 2px solid #2FA7FF;
    text-decoration: none;
    color: #292b2c;
  }
`;

const TabContentStyle = styled.div`
  padding: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: -1px;
  border-top-left-radius: 0;
  background-color: #fff;
`;

// Components
const Tab = props => <TabStyle {...props}>{props.children}</TabStyle>;

const TabContent = props => <TabContentStyle>{props.children}</TabContentStyle>;

const Tabs = props => <TabsStyle>{props.children}</TabsStyle>;

export { Tab, Tabs, TabContent };
