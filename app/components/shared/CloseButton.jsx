// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import styled from 'styled-components';

const ButtonStyle = styled.div`
  color: #fff;
  // Block Level Button
  ${props => props.block && `width: 100%;`}
  // Color
  ${props => props.primary &&  `
    background: #469fe5;
    color: white;
  `}
  ${props => props.success && `
    background: #6bbb69;
    color: white;
  `}
  ${props => props.danger && `
    background: #EC476E;
    color: white;
  `}
  // Active state
  ${props => props.active && `
    background: #F2F3F4;
    color: #4F555C;
  `}
  // Hover
  &:hover {
    cursor: pointer;
    text-decoration: none;
    color: red;
  }
`;

const CloseButtonStyle = styled.div`
  color: #fff;
  // Hover
  &:hover {
    cursor: pointer;
    color: red;
  }
`;

function CloseButton(props)
{
  return (
    <CloseButtonStyle {...props}>{props.children}</CloseButtonStyle>
  );
}

CloseButton.propTypes =
{
  danger: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  success: PropTypes.bool,
};

CloseButton.defaultProps =
{
  primary: false,
  success: false,
  danger: false
};

export default CloseButton;
