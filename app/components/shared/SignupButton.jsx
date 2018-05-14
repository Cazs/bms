// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import styled from 'styled-components';

const SignupButtonStyle = styled.button`
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

function SignupButton(props)
{
  return (
    <SignupButtonStyle {...props}>{props.children}</SignupButtonStyle>
  );
}

SignupButton.propTypes =
{
  danger: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  success: PropTypes.bool,
};

SignupButton.defaultProps =
{
  primary: false,
  success: false,
  danger: false
};

export default SignupButton;
