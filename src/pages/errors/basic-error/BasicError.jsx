import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ButtonW from '../../../components/wrapper/ButtonW';
import image from '../../../assets/image/notfound.svg';
import { setPreviousAllowedUrl } from '../../../services/Auth';

export const NOT_FOUND = 404;
export const NOT_ALLOWED = 403;
export const EDITION_NOT_FOUND = 6000;
export const EDITION_NOT_ENABLED = 6001;
export const SOCIAL_LOGIN_ERROR = 7000;
export const REGISTRATION_INTERVAL = 8000;
export const MESSAGE_WARNING_USER = 9000;

const BasicError = (props) => {
  const { errorCode } = props;

  const history = useHistory();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        padding: '100px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          width: 'fit-content',
          height: 'min-content',
        }}
      >
        <Card elevation={8}>
          <Box width="100%" p={6}>
            <Box display="flex" p={1} width="100%" justifyContent="center">
              {(errorCode === NOT_FOUND || errorCode === EDITION_NOT_FOUND || errorCode === EDITION_NOT_ENABLED) && (
                <img src={image} alt="error-img" />
              )}
              {(errorCode === NOT_ALLOWED ||
                errorCode === SOCIAL_LOGIN_ERROR ||
                errorCode === REGISTRATION_INTERVAL ||
                errorCode === MESSAGE_WARNING_USER) && <Typography variant="h1">403</Typography>}
            </Box>
            <Box display="flex" p={1} width="100%" justifyContent="center">
              <Typography variant="h5">
                {(errorCode === NOT_ALLOWED || errorCode === SOCIAL_LOGIN_ERROR) && t('pages.pageNotAllowed.notAllowed')}
                {errorCode === NOT_FOUND && t('pages.pageNotFound.notFound')}
                {errorCode === EDITION_NOT_FOUND && t('pages.editionNotFound.notFound')}
                {errorCode === EDITION_NOT_ENABLED && t('pages.editionNotEnabled.notEnabled')}
                {errorCode === REGISTRATION_INTERVAL && t('pages.registrationInterval.registrationNotInterval')}
                {errorCode === MESSAGE_WARNING_USER && t('pages.messageWarningUser.warningUser')}
              </Typography>
            </Box>
            <Box display="flex" p={1} width="100%" justifyContent="center">
              <ButtonW
                primary
                onClick={() => {
                  if (errorCode === EDITION_NOT_FOUND || errorCode === EDITION_NOT_ENABLED || errorCode === SOCIAL_LOGIN_ERROR) {
                    window.location.pathname = '/';
                    return;
                  }
                  if (errorCode === NOT_ALLOWED) {
                    setPreviousAllowedUrl(history.location.pathname);
                  }
                  history.replace('/');
                }}
              >
                {t('pages.pageNotAllowed.home')}
              </ButtonW>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
export default BasicError;
