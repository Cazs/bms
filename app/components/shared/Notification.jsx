// React Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Styles
import styled from 'styled-components';

const StyledNotification = styled.div`
  background: #fff;
  height: 70px;
  padding: 20px 40px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #469fe5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${props =>
    props.type === 'warning' && `border-top: 4px solid #F9D548;`} ${props =>
      props.type === 'success' && `border-top: 4px solid #6BBB69;`} ${props =>
      props.type === 'danger' && `border-top: 4px solid #EC476E;`};
`;

const Message = styled.p`
  color: #2c323a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
`;

// Component
class Notification extends Component
{
  constructor(props)
  {
    super(props);
    this.removeNotification = this.removeNotification.bind(this);
  }

  componentDidMount()
  {
    this.timeout = setTimeout(this.removeNotification, 4000);
  }

  shouldComponentUpdate(nextProps)
  {
    return this.props.notification !== nextProps.notification;
  }

  componentWillUnmount()
  {
    clearTimeout(this.timeout);
  }

  removeNotification()
  {
    const { removeNotification, notification } = this.props;
    removeNotification(notification.id);
  }

  render()
  {
    const { notification } = this.props;
    return (
      <StyledNotification type={notification.type} onClick={this.removeNotification}>
        <Message>{notification.message}</Message>
        <a href="#" onClick={this.removeNotification}>
          <i className="ion-android-close" />
        </a>
      </StyledNotification>
    );
  }
}

Notification.propTypes =
{
  notification: PropTypes.object.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

export default Notification;
