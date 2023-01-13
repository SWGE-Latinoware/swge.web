import React from 'react';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import ButtonW from '../../../components/wrapper/ButtonW';
import FormUtils from '../../../utils/FormUtils';
import TitleCard from '../../../components/title-card/TitleCard';
import UserService from '../../../services/UserService';
import { useToast } from '../../../components/context/toast/ToastContext';
import CustomTopbar from '../../../components/layouts/custom-topbar/CustomTopbar';
import HelmetW from '../../../components/wrapper/HelmetW';

const ResetPassword = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { addToast } = useToast();

  const schema = yup.object().shape({
    email: yup.string().required().email(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleReset = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);
    UserService.resetPassword(form.email).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.resetPassword'), type: 'success' });
        history.push('/login');
        return;
      }
      addToast({ body: t('toastes.resetPasswordError'), type: 'error' });
    });
  };

  return (
    <>
      <CustomTopbar hasArrowBack applicationName={t('general.applicationName')} />
      <HelmetW title={t('pages.resetPassword.toolbar.resetPassword')} />
      <Box
        sx={{
          width: '100vw',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          top: 0,
          left: 0,
        }}
      >
        <Box
          sx={{
            width: '50%',
            height: 'min-content',
          }}
        >
          <TitleCard title={t('pages.resetPassword.toolbar.resetPassword')} cardProps={{ elevation: 8 }} boxProps={{ p: 1 }}>
            <Form name="resetPasswordForm" onSubmit={handleSubmit(handleReset)}>
              <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                <Box width="100%" p={1}>
                  <Controller
                    name="email"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.resetPassword.email')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        error={errors?.email}
                        required
                      />
                    )}
                    control={control}
                    rules={{ required: true }}
                  />
                </Box>
                <Box display="flex" flexDirection="row" p={1} width="100%" justifyContent="center">
                  <Box p={1} width="25%">
                    <ButtonW fullWidth secondary onClick={() => history.push('/login')}>
                      {t('pages.resetPassword.cancel')}
                    </ButtonW>
                  </Box>
                  <Box p={1} width="25%">
                    <ButtonW fullWidth primary type="submit">
                      {t('pages.resetPassword.reset')}
                    </ButtonW>
                  </Box>
                </Box>
              </Box>
            </Form>
          </TitleCard>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;
