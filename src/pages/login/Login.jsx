import React, { useEffect, useState } from 'react';
import { Box, Card, FormControlLabel, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { compareAsc, fromUnixTime } from 'date-fns';
import { Email } from '@mui/icons-material';
import Form from '../../components/form-components/Form';
import TextFieldW from '../../components/wrapper/TextFieldW';
import ButtonW from '../../components/wrapper/ButtonW';
import LoginService from '../../services/LoginService';
import FormUtils from '../../utils/FormUtils';
import { getPreviousAllowedUrl, getToken, getUserEmail, login, setPreviousAllowedUrl } from '../../services/Auth';
import ShowHidePassword from '../../components/form-components/ShowHidePassword';
import { useUserChange } from '../../components/context/UserChangeContext';
import SocialButton, { GITHUB, GOOGLE } from '../../components/social-button/SocialButton';
import { useEditionChange } from '../../components/context/EditionChangeContext';
import { StyledCard, TypographyURL } from '../../components/context/ThemeChangeContext';
import BoxW from '../../components/wrapper/BoxW';
import CheckboxW from '../../components/wrapper/CheckboxW';
import CustomTopbar from '../../components/layouts/custom-topbar/CustomTopbar';
import UserService from '../../services/UserService';
import { useToast } from '../../components/context/toast/ToastContext';
import { AppVersions } from '../../components/layouts/sidebarNav/SidebarNav';
import HelmetW from '../../components/wrapper/HelmetW';

const EMAIL_PASSWORD = 1000;
const EMAIL_CONFIRMATION = 1001;
const USER_DISABLED = 1002;

const Login = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { setUserEmail, handleLogout, setUpdateUser, setCurrentUser } = useUserChange();
  const { currentLogo } = useEditionChange();
  const { addToast } = useToast();

  const [errorLogin, setErrorLogin] = useState(false);
  const [errorCodes, setErrorCodes] = useState([]);

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
    rememberMe: yup.boolean(),
  });

  const { handleSubmit, control, formState, watch, getValues } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleLoginSubmit = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);
    setErrorCodes([]);
    LoginService.login(form).then((response) => {
      if (response.status === 200) {
        login(response.data);
        setCurrentUser(undefined);
        setUserEmail(getUserEmail());
        const previousNotAllowedUrl = getPreviousAllowedUrl();
        if (previousNotAllowedUrl != null && previousNotAllowedUrl !== 'null') {
          setPreviousAllowedUrl(null);
          history.replace(previousNotAllowedUrl);
          return;
        }
        history.replace('/home');
        return;
      }
      UserService.validateEmailConfirmation(form.email).then((responseE) => {
        if (responseE.status === 200 && !responseE.data) {
          setErrorCodes([EMAIL_CONFIRMATION]);
          setErrorLogin(true);
          return;
        }
        UserService.validateUserDisabled(form.email).then((responseD) => {
          if (responseD.status === 200 && !responseD.data) {
            setErrorCodes([USER_DISABLED]);
            setErrorLogin(true);
            return;
          }
          setErrorCodes([EMAIL_PASSWORD]);
          setErrorLogin(true);
        });
      });
    });
  };

  const handleEmailConfirmation = () => {
    const email = getValues('email');
    UserService.emailConfirmationEmail(email).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.emailSent'), type: 'success' });
        return;
      }
      addToast({ body: t('toastes.emailSentError'), type: 'error' });
    });
  };

  useEffect(() => {
    const token = getToken();

    if (!token) return;

    const time = fromUnixTime(JSON.parse(window.atob(token.split('.')[1])).exp);

    if (compareAsc(time, new Date()) <= 0) {
      handleLogout();
      return;
    }
    setUserEmail(getUserEmail());
    setUpdateUser(true);
    history.push('/home');
  }, [handleLogout, history, setUpdateUser, setUserEmail]);

  return (
    <BoxW
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <BoxW
        sx={(theme) => ({
          backgroundColor: theme.palette.sidebar.backgroundColor,
          width: '60%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          [theme.breakpoints.down('md')]: {
            width: '50%',
          },
          [theme.breakpoints.down('md')]: {
            display: 'none',
          },
        })}
      >
        <Box component="svg" width="45%" marginBottom={4}>
          <image href={currentLogo} width="100%" height="100%" />
        </Box>
      </BoxW>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          width: '40%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '600px',
          [theme.breakpoints.down('md')]: {
            width: '50%',
          },
        })}
      >
        <Box width="63%" minWidth="300px" minHeight="300px">
          <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Card elevation={8}>
              <HelmetW title={t('pages.login.login')} />
              <CustomTopbar applicationName={t('general.applicationName')} />
              <BoxW component={StyledCard} p={6}>
                <Form name="loginForm" onSubmit={handleSubmit(handleLoginSubmit)}>
                  <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                    <BoxW width="100%" paddingBottom={2}>
                      <Controller
                        name="email"
                        render={({ field }) => (
                          <TextFieldW
                            label={t('pages.login.email')}
                            inputProps={{
                              autoCapitalize: 'none',
                            }}
                            {...field}
                            error={errors?.email}
                            required
                            suffix={
                              <Box marginRight={1}>
                                <Email />
                              </Box>
                            }
                          />
                        )}
                        control={control}
                        rules={{ required: true }}
                      />
                    </BoxW>
                    <BoxW width="100%">
                      <Controller
                        name="password"
                        render={({ field }) => (
                          <ShowHidePassword label={t('pages.login.password')} {...field} error={errors?.password} required />
                        )}
                        control={control}
                        rules={{ required: true }}
                      />
                    </BoxW>
                    {errorLogin && (
                      <BoxW display="flex" flexDirection="row" p={2} width="100%" justifyContent="center" flexWrap="wrap">
                        {errorCodes.map((code) => {
                          switch (code) {
                            case EMAIL_PASSWORD:
                              return (
                                <Box width="100%" key={code}>
                                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.error.main })}>
                                    {t('pages.login.loginError')}
                                  </Typography>
                                </Box>
                              );
                            case EMAIL_CONFIRMATION:
                              return (
                                <Box width="100%" marginTop={0} key={code}>
                                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.error.main })}>
                                    <Box>{t('pages.login.emailConfirmationError')}</Box>
                                    <Box>
                                      <TypographyURL urlType="secondary" urlNoDecorator onClick={handleEmailConfirmation}>
                                        {t('pages.login.resendEmailConfirmation')}
                                      </TypographyURL>
                                    </Box>
                                  </Typography>
                                </Box>
                              );
                            case USER_DISABLED:
                              return (
                                <Box width="100%" key={code}>
                                  <Typography variant="body2" sx={(theme) => ({ color: theme.palette.error.main })}>
                                    {t('pages.login.validateUserDisabled')}
                                  </Typography>
                                </Box>
                              );
                            default:
                              return <></>;
                          }
                        })}
                      </BoxW>
                    )}
                    <BoxW display="inline-flex" width="100%">
                      <BoxW
                        paddingBottom={1}
                        display="flex"
                        width="100%"
                        justifyContent="flex-start"
                        alignContent="flex-start"
                        minWidth="0px"
                      >
                        <Controller
                          name="rememberMe"
                          render={({ field }) => (
                            <FormControlLabel
                              control={<CheckboxW checked={watch('rememberMe', false)} primary {...field} />}
                              label={
                                <Typography color={watch('rememberMe', false) ? 'textPrimary' : 'textSecondary'} variant="body2">
                                  {t('pages.login.rememberMe')}
                                </Typography>
                              }
                              labelPlacement="end"
                            />
                          )}
                          defaultValue={false}
                          control={control}
                        />
                      </BoxW>
                      <BoxW
                        paddingBottom={1}
                        alignItems="center"
                        display="flex"
                        flexDirection="row"
                        width="100%"
                        justifyContent="flex-end"
                        minWidth="0px"
                      >
                        <TypographyURL variant="body1" urlType="secondary" urlNoDecorator onClick={() => history.push('/reset-password')}>
                          {t('pages.login.forgotPassword')}
                        </TypographyURL>
                      </BoxW>
                    </BoxW>
                    <BoxW display="flex" flexDirection="row" width="100%" paddingBottom={2} justifyContent="center">
                      <BoxW width="100%">
                        <ButtonW fullWidth primary type="submit">
                          {t('pages.login.login')}
                        </ButtonW>
                      </BoxW>
                    </BoxW>
                    <BoxW display="flex" width="100%" justifyContent="center">
                      <Typography variant="body2">{t('pages.login.socialsLogin')}</Typography>
                    </BoxW>
                    <BoxW display="flex" p={2} flexDirection="row" justifyContent="center" width="100%" flexWrap="wrap">
                      <BoxW minWidth="0px">
                        <SocialButton variant={GITHUB} />
                        <Typography align="center" fontSize={12}>
                          GitHub
                        </Typography>
                      </BoxW>
                      <BoxW minWidth="0px">
                        <SocialButton variant={GOOGLE} />
                        <Typography align="center" fontSize={12}>
                          Google
                        </Typography>
                      </BoxW>
                    </BoxW>
                    <BoxW display="flex" flexDirection="row" width="100%" justifyContent="center">
                      <TypographyURL
                        variant="body1"
                        urlType="secondary"
                        urlNoDecorator
                        sx={{ paddingRight: 1 }}
                        onClick={() => history.push('/auto-registration')}
                      >
                        {t('pages.login.noRecord')}
                      </TypographyURL>
                      <TypographyURL variant="body1" urlType="primary" urlNoDecorator onClick={() => history.push('/auto-registration')}>
                        {t('pages.login.register')}
                      </TypographyURL>
                    </BoxW>
                    <BoxW display="flex" flexDirection="row" width="100%" justifyContent="center" pt={2} pb={0}>
                      <BoxW width="33%" minWidth="50px">
                        <TypographyURL
                          variant="body1"
                          urlType="secondary"
                          onClick={() => history.push(`/terms/privacy-policy`)}
                          align="center"
                        >
                          {t('pages.login.terms.privacyPolicy')}
                        </TypographyURL>
                      </BoxW>
                      <BoxW width="33%" minWidth="50px">
                        <TypographyURL variant="body1" urlType="secondary" onClick={() => history.push(`/terms/use-term`)} align="center">
                          {t('pages.login.terms.useTerm')}
                        </TypographyURL>
                      </BoxW>
                      <BoxW width="33%" minWidth="50px">
                        <TypographyURL
                          variant="body1"
                          urlType="secondary"
                          onClick={() => history.push(`/terms/api-use-term`)}
                          align="center"
                        >
                          {t('pages.login.terms.apiUseTerm')}
                        </TypographyURL>
                      </BoxW>
                    </BoxW>
                  </BoxW>
                </Form>
              </BoxW>
            </Card>
            <BoxW width="50%">
              <AppVersions />
            </BoxW>
          </BoxW>
        </Box>
      </Box>
    </BoxW>
  );
};
export default Login;
