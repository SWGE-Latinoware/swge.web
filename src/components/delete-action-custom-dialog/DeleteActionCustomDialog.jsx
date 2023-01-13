import React, { useCallback, useEffect } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isBefore } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import CustomDialog from '../custom-dialog/CustomDialog';
import BoxW from '../wrapper/BoxW';
import TextFieldW from '../wrapper/TextFieldW';
import DateTimePickerW from '../wrapper/DateTimePickerW';
import Form from '../form-components/Form';
import FormUtils from '../../utils/FormUtils';
import UserService from '../../services/UserService';
import { useUserChange } from '../context/UserChangeContext';
import RequestType from '../../enums/RequestType';
import { useToast } from '../context/toast/ToastContext';
import ExclusionService from '../../services/ExclusionService';

const DeleteActionCustomDialog = (props) => {
  const { isUserDelete, buttonErrorOnClick, id, service, ...otherProps } = props;

  const { addToast } = useToast();
  const { t } = useTranslation();
  const { isDPO } = useUserChange();

  const schema = yup.object().shape({
    note: isDPO ? yup.string().required() : yup.string(),
    applicantContact: yup.string().required(),
    requestDate: yup
      .date()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minDate', '', () => validateDate()),
  });

  const { control, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const validateDate = () => {
    const requestDate = getValues('requestDate');
    if (!requestDate) return false;
    return isBefore(new Date(requestDate), new Date());
  };

  useEffect(() => {
    if (!isDPO) {
      setValue('requestDate', new Date());
    }
  }, [isDPO, setValue]);

  const handleSave = useCallback(
    (formDeleteRequest) => {
      const form = FormUtils.removeEmptyFields(formDeleteRequest);

      form.requestType = isDPO ? RequestType.getValue('ANONYMOUS') : RequestType.getValue('USER');

      service.findOne(id).then((searchResponse) => {
        if (searchResponse.status === 200) {
          const exclusionForm = { deleteRequest: form, registryDate: new Date() };
          if (service === UserService) exclusionForm.user = searchResponse.data;
          else {
            exclusionForm.tutoredUser = searchResponse.data;
          }

          ExclusionService.create(exclusionForm).then((response) => {
            if (response.status === 200) {
              addToast({ body: t('toastes.exclusionRequest'), type: 'success' });
              buttonErrorOnClick();
            } else if (response.status >= 400 && response.status <= 500) {
              addToast({ body: t('toastes.exclusionRequestError'), type: 'error' });
            }
          });
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    },
    [isDPO, service, id, addToast, t, buttonErrorOnClick]
  );

  return (
    <>
      {isUserDelete ? (
        <>
          <CustomDialog
            title={t('dialog.userDeleteDialogTitle')}
            buttonOnClick={handleSubmit(handleSave)}
            content={
              <Form name="promotionForm" onSubmit={handleSubmit(handleSave)}>
                <BoxW p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
                  <BoxW p={1}>
                    <Typography>{t('dialog.userDeleteDialogContent')}</Typography>
                  </BoxW>
                  <BoxW p={1} paddingLeft={0}>
                    <Typography sx={{ fontWeight: 'bold' }} fontSize={14}>
                      {t('dialog.userDeleteWarning')}
                      <Link href={process.env.REACT_APP_LGPD_LINK} underline="always" sx={{ paddingLeft: 1 }}>
                        LGPD
                      </Link>
                    </Typography>
                  </BoxW>
                </BoxW>
                <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px" flexDirection="column">
                  <Box p={1}>
                    <Controller
                      name="requestDate"
                      render={({ field }) => (
                        <DateTimePickerW
                          label={t('pages.exclusion.columns.requestDate')}
                          {...field}
                          error={errors?.requestDate}
                          required={isDPO}
                          maxDateTime={new Date()}
                          disabled={!isDPO}
                        />
                      )}
                      control={control}
                      defaultValue={null}
                      rules={{ required: isDPO }}
                    />
                  </Box>
                  <Box p={1}>
                    <Controller
                      name="applicantContact"
                      render={({ field }) => (
                        <TextFieldW
                          label={t('pages.exclusion.columns.applicantContact')}
                          {...field}
                          error={errors?.applicantContact}
                          required
                        />
                      )}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Box>
                  <Box p={1}>
                    <Controller
                      name="note"
                      render={({ field }) => (
                        <TextFieldW label={t('pages.exclusion.columns.note')} {...field} error={errors?.note} required={isDPO} />
                      )}
                      control={control}
                      rules={{ required: isDPO }}
                    />
                  </Box>
                </Box>
              </Form>
            }
            buttonText={t('dialog.userDelete')}
            buttonErrorText={t('dialog.cancelDeleteDialog')}
            {...otherProps}
          />
        </>
      ) : (
        <CustomDialog
          title={t('dialog.deleteDialogTitle')}
          content={
            <BoxW p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
              <BoxW p={1}>
                <Typography>{t('dialog.deleteDialogContent')}</Typography>
              </BoxW>
              <BoxW p={1} paddingLeft={0}>
                <Typography sx={{ fontWeight: 'bold' }}>{t('dialog.warning')}</Typography>
              </BoxW>
            </BoxW>
          }
          buttonText={t('dialog.cancelDeleteDialog')}
          buttonErrorText={t('dialog.delete')}
          buttonErrorOnClick={buttonErrorOnClick}
          {...otherProps}
        />
      )}
    </>
  );
};

export default DeleteActionCustomDialog;
