// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import styled from 'styled-components';
const Wrapper = styled.div`
  position: fixed;
  height: auto;
  bottom: 0;
  width: 100%;
  padding-left: 120px;
  padding-right: 40px;
  z-index: 10000;
`;

// Component
import Notification from '../../components/shared/Notification';
import TransitionList from '../../components/shared/TransitionList';

function AppNotification({ notifications, removeNotification })
{
  const notificationsComponent = notifications.map(notification =>
    (
      <Notification
        key={notification.id}
        notification={notification}
        removeNotification={removeNotification}
      />
    ));
  return (
    <Wrapper>
      <TransitionList componentHeight={90}>
        {notificationsComponent}
      </TransitionList>
    </Wrapper>
  );
}

AppNotification.propTypes = {
  notifications: PropTypes.array.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

export default AppNotification;
