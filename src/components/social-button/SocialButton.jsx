import React from 'react';
import _ from 'lodash';
import { GithubLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

export const GOOGLE = 'Google';
export const GITHUB = 'GitHub';

const SocialButton = (props) => {
  const {
    style, variant, children, ...otherProps
  } = props;

  const finalStyle = _.merge(
    {},
    {
      fontFamily: 'inherit',
      fontSize: 16,
      borderRadius: 12,
    },
    style || {},
    children ? {} : {
      width: 50,
      borderRadius: 50,
      paddingInlineStart: 12,
    },
  );

  const Component = variant === GOOGLE ? GoogleLoginButton : GithubLoginButton;

  const handleSocialLogin = (identity) => {
    let url = `http://localhost:8080/api/oauth2/authorize/${identity}`;
    let redirectUrl = 'http://localhost:3000/oauth2/redirect';
    if (process.env.NODE_ENV === 'production') {
      url = `${window.location.protocol}//${window.location.hostname}/api/oauth2/authorize/${identity}`;
      redirectUrl = `${window.location.protocol}//${window.location.host}/oauth2/redirect`;
    }
    window.open(`${url}?redirect_uri=${redirectUrl}`, '_self');
  };

  const handleGoogleLogin = () => {
    handleSocialLogin('google');
  };

  const handleGitHubLogin = () => {
    handleSocialLogin('github');
  };

  return (
    <Component
      style={finalStyle}
      onClick={() => (variant === GOOGLE ? handleGoogleLogin() : handleGitHubLogin())}
      {...otherProps}
    >
      {children || ''}
    </Component>
  );
};

export default SocialButton;
