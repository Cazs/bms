// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Styles
import styled from 'styled-components';

const LoginButtonStyle = styled.button`
  width: 150px;
  height: 50px;
  font-size: 18pt;
  background-color: rgba(0,255,0,.4);
  border: 1px solid #fff;
  border-radius: 3px;
  color: #fff;
  &:hover
  {
    background-color: rgba(0,200,0,1);
    color: #000;
  }
`;

function LoginButton(props)
{
  return (
    <LoginButtonStyle {...props}>{props.children}</LoginButtonStyle>
  );
}

LoginButton.propTypes =
{
  danger: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  success: PropTypes.bool,
};

LoginButton.defaultProps =
{
  primary: false,
  success: false,
  danger: false
};

export default LoginButton;