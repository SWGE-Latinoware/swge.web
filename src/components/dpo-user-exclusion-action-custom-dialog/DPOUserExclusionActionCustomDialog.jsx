import React from 'react';
import { Avatar, Box, Chip, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import CustomDialog from '../custom-dialog/CustomDialog';
import TextFieldW from '../wrapper/TextFieldW';
import Form from '../form-components/Form';
import DateTimePickerW from '../wrapper/DateTimePickerW';
import BoxW from '../wrapper/BoxW';
import FormUtils from '../../utils/FormUtils';
import { useToast } from '../context/toast/ToastContext';
import Selector from '../form-components/Selector';
import ExclusionStatus from '../../enums/ExclusionStatus';
import RequestType from '../../enums/RequestType';
import ExclusionService from '../../services/ExclusionService';
import { StyledCard, TypographyURL, useThemeChange } from '../context/ThemeChangeContext';
import useLocation from '../hook/useLocation';

const DPOUserExclusionActionCustomDialog = (props) => {
  const { openDialog, setOpenDialog, requestData, ...otherProps } = props;
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentTheme } = useThemeChange();
  const { getCountryName, getStateName, formatLocaleDateString } = useLocation();

  const schema = yup.object().shape({
    effectiveDeletionDate: yup.date().required(),
  });

  const { control, formState, handleSubmit } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      effectiveDeletionDate: new Date(),
    },
  });

  const { errors } = formState;

  const handleSave = (formExclusion) => {
    const form = FormUtils.removeEmptyFields(formExclusion);
    const forms = { ...requestData, ...form };

    ExclusionService.conclude(forms).then((resp) => {
      if (resp.status === 200) {
        addToast({ body: t('toastes.finalDelete'), type: 'success' });
        setOpenDialog(false);
        return;
      }
      addToast({ body: t('toastes.finalDeleteError'), type: 'error' });
    });
  };

  const getFirstLetters = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'xl' }}
      title={t('userExclusion.dialogTitle')}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      content={
        <Form name="userExclusion" onSubmit={handleSubmit(handleSave)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            <StyledCard p={0} elevation={4} sx={{ paddingBottom: '10px' }}>
              {requestData?.user && (
                <BoxW
                  flexDirection="row"
                  display="flex"
                  flexWrap="wrap"
                  width="100%"
                  justifyContent="center"
                  height="300px"
                  overflow="auto"
                >
                  <BoxW p={7} width="15%">
                    <Avatar
                      sx={{ width: 150, height: 150, border: '2px solid', borderColor: currentTheme.getContrastText }}
                      src={requestData?.user.src}
                    >
                      <Typography variant="h3" color="inherit" align="center">
                        {getFirstLetters(requestData?.user.name)}
                      </Typography>
                    </Avatar>
                  </BoxW>
                  <BoxW flexDirection="column" display="flex" flexWrap="wrap" width="35%" p={2}>
                    <Typography paddingTop={requestData?.user.exclusion ? 0 : 5} variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.name}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.email}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      ID: {requestData?.user.id}
                    </Typography>
                    <Typography paddingTop={5} variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.birthDate')}</p>:
                      {requestData?.user.birthDate && formatLocaleDateString(requestData?.user.birthDate)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" pb={1}>
                      {getCountryName(requestData?.user.country)}
                    </Typography>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                      <Typography variant="body2" pr={3} fontWeight="bold" pb={1}>
                        {getStateName(requestData?.user.state)}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" pb={1}>
                        {requestData?.user.city}
                      </Typography>
                    </BoxW>
                    <Typography variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.zipCode')}</p>: {requestData?.user.zipCode}
                    </Typography>
                    <Typography variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.addressUnique')}</p>:{' '}
                      {requestData?.user.addressLine1}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" pb={1}>
                      {requestData?.user.institution?.name}
                    </Typography>
                    <Typography variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.mobilePhone')}</p>:{' '}
                      {requestData?.user.cellPhone}
                    </Typography>
                    <Typography variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.phone')}</p>: {requestData?.user.phone}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" pb={1}>
                      {t('pages.myAccount.specialNeedsText')}
                    </Typography>
                    <BoxW flexDirection="column" display="flex" flexWrap="wrap">
                      {requestData?.user.needsTypes.map((need) => (
                        <BoxW p={0.5}>
                          <Chip key={need} label={t(`enums.specialNeeds.${need}`)} />
                        </BoxW>
                      ))}
                    </BoxW>
                  </BoxW>
                  <BoxW flexDirection="column" display="flex" flexWrap="wrap" width="40%" p={2}>
                    <Typography paddingTop={5} variant="body1" fontWeight="bold" pb={1}>
                      {t('pages.myAccount.biography')}
                    </Typography>
                    <BoxW>
                      <Typography variant="body2" pb={1}>
                        {requestData?.user.bibliography?.blocks[0].text}
                      </Typography>
                    </BoxW>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap" paddingTop={5}>
                      <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                        {t('pages.myAccount.github')}
                      </Typography>
                      <TypographyURL variant="body2" pb={1}>
                        {requestData?.user.github}
                      </TypographyURL>
                    </BoxW>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                      <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                        {t('pages.myAccount.orcid')}
                      </Typography>
                      <TypographyURL variant="body2" pb={1}>
                        {requestData?.user.orcid}
                      </TypographyURL>
                    </BoxW>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                      <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                        {t('pages.myAccount.linkedin')}
                      </Typography>
                      <TypographyURL variant="body2" pb={1}>
                        {requestData?.user.linkedin}
                      </TypographyURL>
                    </BoxW>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                      <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                        {t('pages.myAccount.website')}
                      </Typography>
                      <TypographyURL variant="body2" pb={1}>
                        {requestData?.user.website}
                      </TypographyURL>
                    </BoxW>
                    <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                      <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                        {t('pages.myAccount.lattes')}
                      </Typography>
                      <TypographyURL variant="body2" pb={1}>
                        {requestData?.user.lattes}
                      </TypographyURL>
                    </BoxW>
                    <Typography paddingTop={5} variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.admin ? t('pages.myAccount.admin') : ''}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.enabled ? t('pages.myAccount.enabled') : t('pages.myAccount.notEnabled')}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.confirmed ? t('pages.myAccount.confirmed') : t('pages.myAccount.notConfirmed')}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.emailCommunication ? t('pages.myAccount.communication') : ''}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.user.socialCommunication ? t('pages.myAccount.socialCommunication') : ''}
                    </Typography>
                  </BoxW>
                </BoxW>
              )}
              {requestData?.tutoredUser && (
                <BoxW
                  flexDirection="row"
                  display="flex"
                  flexWrap="wrap"
                  width="100%"
                  justifyContent="center"
                  height="300px"
                  overflow="auto"
                >
                  <BoxW p={7} width="15%">
                    <Avatar sx={{ width: 150, height: 150, border: '2px solid', borderColor: currentTheme.getContrastText }}>
                      <Typography variant="h3" color="inherit" align="center">
                        {getFirstLetters(requestData?.tutoredUser.name)}
                      </Typography>
                    </Avatar>
                  </BoxW>
                  <BoxW flexDirection="column" display="flex" flexWrap="wrap" width="35%" p={2}>
                    <Typography paddingTop={5} variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.tutoredUser.name}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      {requestData?.tutoredUser.email}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" pb={1}>
                      ID: {requestData?.tutoredUser.id}
                    </Typography>
                    <Typography paddingTop={2} variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.birthDate')}</p>:
                      {requestData?.tutoredUser.birthDate && formatLocaleDateString(requestData?.tutoredUser.birthDate)}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" pb={1}>
                      {getCountryName(requestData?.tutoredUser.country)}
                    </Typography>
                    <Typography variant="body2" pb={1}>
                      <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.mobilePhone')}</p>:{' '}
                      {requestData?.tutoredUser.cellPhone}
                    </Typography>
                    {requestData?.tutoredUser.needsTypes.length > 0 && (
                      <>
                        <Typography variant="body2" fontWeight="bold" pb={1}>
                          {t('pages.myAccount.specialNeedsText')}
                        </Typography>
                        <BoxW flexDirection="column" display="flex" flexWrap="wrap">
                          {requestData?.tutoredUser.needsTypes.map((need) => (
                            <BoxW p={0.5}>
                              <Chip key={need} label={t(`enums.specialNeeds.${need}`)} />
                            </BoxW>
                          ))}
                        </BoxW>
                      </>
                    )}
                  </BoxW>
                </BoxW>
              )}
            </StyledCard>

            <Box width="5%" p={1} marginTop="15px">
              <TextFieldW label={t('pages.userExclusion.id')} value={requestData?.id} disabled />
            </Box>
            <Box width="45%" p={1} marginTop="15px">
              <DateTimePickerW label={t('pages.userExclusion.registryDate')} value={requestData?.registryDate} disabled />
            </Box>
            <BoxW width="50%" p={1} marginTop="15px">
              <Selector label={t('pages.userExclusion.status')} value={ExclusionStatus.getValue(requestData?.status)} disabled>
                {ExclusionStatus.enums.map((item) => (
                  <MenuItem key={item.key} value={item.value}>
                    {t(`enums.exclusionStatus.${item.key}`)}
                  </MenuItem>
                ))}
              </Selector>
            </BoxW>
            <Box width="50%" p={1}>
              <DateTimePickerW label={t('pages.userExclusion.requestDate')} value={requestData?.deleteRequest?.requestDate} disabled />
            </Box>
            <Box width="50%" p={1}>
              <TextFieldW label={t('pages.userExclusion.applicantContact')} value={requestData?.deleteRequest?.applicantContact} disabled />
            </Box>
            <Box width="50%" p={1}>
              <TextFieldW label={t('pages.userExclusion.note')} value={requestData?.deleteRequest?.note} disabled />
            </Box>
            <Box width="50%" p={1}>
              <Selector
                label={t('pages.userExclusion.requestType')}
                value={RequestType.getValue(requestData?.deleteRequest?.requestType)}
                disabled
              >
                {RequestType.enums.map((item) => (
                  <MenuItem key={item.key} value={item.value}>
                    {t(`enums.requestType.${item.key}`)}
                  </MenuItem>
                ))}
              </Selector>
            </Box>
            <BoxW width="100%" p={1} minWidth="200px">
              <TextFieldW label={t('pages.userExclusion.note')} value={requestData?.note} disabled />
            </BoxW>
            <Box width="50%" p={1}>
              <DateTimePickerW label={t('pages.userExclusion.returnDate')} value={requestData?.returnDate} disabled />
            </Box>
            <Box width="50%" p={1}>
              <DateTimePickerW label={t('pages.userExclusion.deadlineExclusionDate')} value={requestData?.deadlineExclusionDate} disabled />
            </Box>
            {requestData?.effectiveDeletionDate && (
              <Box width="100%" p={1}>
                <Controller
                  name="effectiveDeletionDate"
                  render={({ field }) => (
                    <DateTimePickerW
                      label={t('pages.userExclusion.effectiveDeletionDate')}
                      {...field}
                      error={errors?.effectiveDeletionDate}
                      required
                      minDateTime={new Date()}
                      disabled
                    />
                  )}
                  control={control}
                  defaultValue={requestData?.effectiveDeletionDate}
                />
              </Box>
            )}
          </Box>
        </Form>
      }
      buttonText={requestData?.effectiveDeletionDate === null && t('userExclusion.send')}
      buttonErrorText={requestData?.effectiveDeletionDate === null && t('userExclusion.cancel')}
      buttonOnClick={handleSubmit(handleSave)}
      buttonErrorOnClick={() => setOpenDialog(false)}
      {...otherProps}
    />
  );
};

export default DPOUserExclusionActionCustomDialog;
