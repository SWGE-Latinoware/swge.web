import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import { getPreviousAllowedUrl, login, setPreviousAllowedUrl } from '../../services/Auth';
import BasicError, { SOCIAL_LOGIN_ERROR } from '../errors/basic-error/BasicError';
import { useUserChange } from '../../components/context/UserChangeContext';

const TokenRedirect = (props) => {
  const { token } = props;

  const history = useHistory();

  useEffect(() => {
    if (token != null && token !== 'null') {
      login(token);
      const previousNotAllowedUrl = getPreviousAllowedUrl();
      if (previousNotAllowedUrl != null && previousNotAllowedUrl !== 'null') {
        setPreviousAllowedUrl(null);
        history.replace(previousNotAllowedUrl);
        return;
      }
      history.replace('/');
    }
  }, [history, token]);

  return <></>;
};

const OAuth2RedirectHandler = () => {
  const { token, error } = useParams();
  const { handleLogout } = useUserChange();

  const isError = error === 'true' || token === 'null' || token == null;

  if (isError) {
    handleLogout();
  }

  return isError ? <BasicError errorCode={SOCIAL_LOGIN_ERROR} /> : <TokenRedirect token={token} />;
};

export default OAuth2RedirectHandler;
