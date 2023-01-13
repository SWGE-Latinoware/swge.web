import React, { useMemo, useState } from 'react';
import { Box, MenuItem, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import _ from 'lodash';
import * as Colors from '@mui/material/colors';
import CustomDialog from '../custom-dialog/CustomDialog';
import TextFieldW from '../wrapper/TextFieldW';
import Form from '../form-components/Form';
import DateTimePickerW from '../wrapper/DateTimePickerW';
import DropzoneAreaW from '../wrapper/DropzoneAreaW';
import BoxW from '../wrapper/BoxW';
import FormUtils from '../../utils/FormUtils';
import FileService from '../../services/FileService';
import { useToast } from '../context/toast/ToastContext';
import Selector from '../form-components/Selector';
import ExclusionStatus from '../../enums/ExclusionStatus';
import RequestType from '../../enums/RequestType';
import UserInfoCard from '../../pages/users/user-card/UserInfoCard';
import { SimpleContentDisplay } from '../../pages/registrations/my-registration/ActivityCard';
import ExclusionService from '../../services/ExclusionService';
import { useUserChange } from '../context/UserChangeContext';
import TutoredUserInfoCard from '../tutored-card/TutoredUserInfoCard';

const DPOManageExclusionActionCustomDialog = (props) => {
  const { openDialog, setOpenDialog, requestData, ...otherProps } = props;
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { currentUser } = useUserChange();

  const [uploadedFile, setUploadedFile] = useState(null);

  const schema = yup.object().shape({
    registryDate: yup.date().required(),
    status: yup.number().required(),
    returnDate: yup.date(),
    deadlineExclusionDate: yup.date().required(),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      ...requestData,
      returnDate: new Date(),
    },
  });

  const id = requestData?.id;

  const { errors } = formState;

  const attachment = watch('attachment', undefined);

  const status = watch('status', ExclusionStatus.getValue('NOT_ANALYZED'));

  const initialFile = useMemo(() => attachment && [attachment], [attachment]);

  const avatarColor = useMemo(() => _.sample(Colors)[500], []);

  const handleSave = (formExclusion) => {
    const form = FormUtils.removeEmptyFields(formExclusion);
    form.returnDate = new Date();
    form.user = requestData.user;
    form.deleteRequest = requestData.deleteRequest;
    form.dpo = currentUser;

    if (uploadedFile) {
      const attachmentForm = new FormData();
      const parts = uploadedFile.name.split('.');
      attachmentForm.append('name', `${id}-exclusion-attachment`);
      if (parts.length > 1) {
        attachmentForm.append('format', parts[parts.length - 1]);
      }
      attachmentForm.append('file', uploadedFile);
      if (id && attachment) attachmentForm.append('id', attachment.id);
      const promise = attachment?.id ? FileService.update(attachmentForm) : FileService.create(attachmentForm);
      promise.then((response) => {
        if (response.status === 200) {
          form.attachment = response.data;
          ExclusionService.update(form).then((resp) => {
            if (resp.status === 200) {
              addToast({ body: t('toastes.exclusionUpdateSave'), type: 'success' });
              setOpenDialog(false);
              return;
            }
            addToast({ body: t('toastes.exclusionUpdateSaveError'), type: 'error' });
          });
          return;
        }
        addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
      });
    } else if (!uploadedFile && status !== ExclusionStatus.getValue('DENIED')) {
      ExclusionService.update(form).then((resp) => {
        if (resp.status === 200) {
          addToast({ body: t('toastes.exclusionUpdateSave'), type: 'success' });
          setOpenDialog(false);
          return;
        }
        addToast({ body: t('toastes.exclusionUpdateSaveError'), type: 'error' });
      });
    } else {
      addToast({ body: t('toastes.exclusionNoFile'), type: 'error' });
    }
  };

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'xl' }}
      title={t('manageExclusion.dialogTitle')}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      content={
        <Form name="manageExclusion" onSubmit={handleSubmit(handleSave)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            <Box width="100%" p={1} display="flex" justifyContent="center">
              <SimpleContentDisplay
                leftItem={requestData?.user ? t('pages.dpoManage.user') : t('pages.dpoManage.tutoredUser')}
                rightItem={
                  requestData?.user ? (
                    <UserInfoCard user={requestData?.user} avatarColor={avatarColor} />
                  ) : (
                    <TutoredUserInfoCard tutoredUser={requestData?.tutoredUser} />
                  )
                }
              />
            </Box>
            <Box width="5%" p={1}>
              <Controller
                name="id"
                render={({ field }) => <TextFieldW label={t('pages.dpoManage.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </Box>
            <Box width="45%" p={1}>
              <Controller
                name="registryDate"
                render={({ field }) => (
                  <DateTimePickerW label={t('pages.dpoManage.registryDate')} {...field} error={errors?.registryDate} disabled />
                )}
                defaultValue={requestData?.registryDate}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <BoxW width="50%" p={1}>
              <Controller
                name="status"
                render={({ field }) => (
                  <Selector
                    label={t('pages.dpoManage.status')}
                    {...field}
                    error={errors?.exclusion}
                    required
                    value={ExclusionStatus.getValue(field.value)}
                    disabled={requestData?.status !== 'NOT_ANALYZED'}
                  >
                    {ExclusionStatus.enums.map((item) => (
                      <MenuItem key={item.key} value={item.value}>
                        {t(`enums.exclusionStatus.${item.key}`)}
                      </MenuItem>
                    ))}
                  </Selector>
                )}
                defaultValue={ExclusionStatus.getValue('NOT_ANALYZED')}
                control={control}
                rules={{ required: true }}
              />
            </BoxW>
            <Box width="100%" p={1}>
              <Typography>{t('pages.dpoManage.deleteRequestBegin')}</Typography>
            </Box>
            <Box width="50%" p={1}>
              <DateTimePickerW label={t('pages.dpoManage.requestDate')} value={requestData?.deleteRequest?.requestDate} disabled />
            </Box>
            <Box width="50%" p={1}>
              <TextFieldW label={t('pages.dpoManage.applicantContact')} value={requestData?.deleteRequest?.applicantContact} disabled />
            </Box>
            <Box width="50%" p={1}>
              <TextFieldW label={t('pages.dpoManage.note')} value={requestData?.deleteRequest?.note} disabled />
            </Box>
            <Box width="50%" p={1}>
              <Selector
                label={t('pages.dpoManage.requestType')}
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
            <Box width="100%" p={1}>
              <Typography>{t('pages.dpoManage.deleteRequestEnd')}</Typography>
            </Box>
            <BoxW width="100%" p={1} minWidth="200px">
              <Controller
                name="note"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.dpoManage.note')}
                    {...field}
                    error={errors?.note}
                    required
                    disabled={requestData?.status !== 'NOT_ANALYZED'}
                  />
                )}
                defaultValue={requestData?.note}
                control={control}
                rules={{ required: true }}
              />
            </BoxW>
            {requestData?.returnDate && (
              <Box width="50%" p={1}>
                <Controller
                  name="returnDate"
                  render={({ field }) => (
                    <DateTimePickerW
                      label={t('pages.dpoManage.returnDate')}
                      {...field}
                      error={errors?.returnDate}
                      required
                      minDateTime={new Date()}
                      disabled
                    />
                  )}
                  control={control}
                  defaultValue={requestData?.returnDate}
                  rules={{ required: true }}
                />
              </Box>
            )}
            <Box width={requestData?.returnDate ? '50%' : '100%'} p={1}>
              <Controller
                name="deadlineExclusionDate"
                render={({ field }) => (
                  <DateTimePickerW
                    label={t('pages.dpoManage.deadlineExclusionDate')}
                    {...field}
                    error={errors?.deadlineExclusionDate}
                    required
                    minDateTime={new Date()}
                    disabled={requestData?.status !== 'NOT_ANALYZED'}
                  />
                )}
                control={control}
                defaultValue={requestData?.deadlineExclusionDate ? requestData.deadlineExclusionDate : new Date()}
                rules={{ required: true }}
              />
            </Box>
            <BoxW p={1} width="100%">
              <DropzoneAreaW
                initialFiles={initialFile}
                dropzoneText={t('pages.dpoManage.attachment')}
                onChange={(files) => setUploadedFile(files[0])}
                dropzoneProps={requestData?.status !== 'NOT_ANALYZED' && { disabled: true }}
              />
            </BoxW>
          </Box>
        </Form>
      }
      buttonText={requestData?.status === 'NOT_ANALYZED' && t('manageExclusion.send')}
      buttonErrorText={requestData?.status === 'NOT_ANALYZED' && t('manageExclusion.cancel')}
      buttonOnClick={handleSubmit(handleSave)}
      buttonErrorOnClick={() => setOpenDialog(false)}
      {...otherProps}
    />
  );
};

export default DPOManageExclusionActionCustomDialog;
