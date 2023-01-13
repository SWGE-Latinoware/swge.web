import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { differenceInYears } from 'date-fns';
import TextFieldW from '../../../../components/wrapper/TextFieldW';
import CountryAutoComplete from '../../../../components/form-components/CountryAutoComplete';
import ConditionalMaskField from '../../../../components/form-components/ConditionalMaskField';
import FormUtils from '../../../../utils/FormUtils';
import DatePickerW from '../../../../components/wrapper/DatePickerW';
import Form from '../../../../components/form-components/Form';
import useFormUtils from '../../../../components/hook/useFormUtils';
import CustomDialog from '../../../../components/custom-dialog/CustomDialog';
import TutoredUserService from '../../../../services/TutoredUserService';
import { TypographyURL } from '../../../../components/context/ThemeChangeContext';
import TermDialog from '../../../terms/TermDialog';
import DropzoneAreaW from '../../../../components/wrapper/DropzoneAreaW';
import BoxW from '../../../../components/wrapper/BoxW';
import FileService from '../../../../services/FileService';

const InsertTutoredUserDialog = (props) => {
  const { openDialog, handleInsertTutored, setOpenDialog, formData, setFormData, onlyFile } = props;
  const { t } = useTranslation();
  const { validateMask, validateUnique } = useFormUtils();

  const [tutoredUserCountry, setTutoredUserCountry] = useState('BR');
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);

  const [termName, setTermName] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required(),
    tagName: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUnique(TutoredUserService, 'tag-name', value, 'tagName', originalUniqueValues?.tagName === value)
      ),
    country: yup.string().required(),
    cellPhone: yup
      .string()
      .ensure()
      .test('match', '', (value) => validateMask(value, tutoredUserCountry)),
    birthDate: yup.date().required(),
    idNumber: yup
      .string()
      .required()
      .test('match', '', (value) => validateMask(value, tutoredUserCountry))
      .test('unique', '', (value) =>
        validateUnique(TutoredUserService, 'id-number', value, 'idNumber', originalUniqueValues?.idNumber === value)
      ),
  });

  const { control, formState, handleSubmit, watch, getValues } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      ...formData,
    },
  });

  useEffect(() => {
    if (formData) {
      const uniqueValues = {};
      uniqueValues.idNumber = formData.idNumber;
      uniqueValues.tagName = formData.tagName;
      setOriginalUniqueValues(uniqueValues);
    }
  }, [formData]);

  const { errors } = formState;

  const handleClose = () => {
    setOpenDialog(false);
    setFormData(null);
  };

  const authorization = watch('authorization', undefined);

  const id = watch('id', undefined);

  const birthDate = watch('birthDate', undefined);

  const initialFile = useMemo(() => authorization && [authorization], [authorization]);

  const handleInsertTutoredParticipant = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);

    if (uploadedFile) {
      const authorizationForm = new FormData();
      const parts = uploadedFile.name.split('.');
      authorizationForm.append('name', `${getValues('name')}-authorization`);
      if (parts.length > 1) {
        authorizationForm.append('format', parts[parts.length - 1]);
      }
      authorizationForm.append('file', uploadedFile);
      if (id && authorization) authorizationForm.append('id', authorization.id);
      const promise = authorization?.id ? FileService.update(authorizationForm) : FileService.create(authorizationForm);
      promise.then((response) => {
        form.authorization = response.data;
        handleInsertTutored(form);
        handleClose();
      });
    } else {
      handleInsertTutored(form);
      handleClose();
    }
  };

  return (
    <>
      <TermDialog termName={termName} open={open} onClose={() => setOpen(false)} dialogProps={{ maxWidth: 'xl' }} />
      <CustomDialog
        dialogProps={{ maxWidth: 'lg' }}
        open={openDialog}
        onClose={handleClose}
        title={t('pages.editManageCaravan.insertDialogTitle')}
        buttonText={t('pages.editManageCaravan.cancelInsertDialog')}
        buttonOnClick={handleSubmit(handleInsertTutoredParticipant)}
        content={
          <Form name="participantForm" onSubmit={handleSubmit(handleInsertTutoredParticipant)}>
            <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
              <Box width="50%" p={1}>
                <Controller
                  name="name"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editManageCaravan.tutoredUser.name')}
                      {...field}
                      error={errors?.name}
                      required
                      disabled={onlyFile}
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </Box>
              <Box width="30%" p={1}>
                <Controller
                  name="tagName"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.editManageCaravan.tutoredUser.tagName')}
                      {...field}
                      error={errors?.tagName}
                      required
                      disabled={onlyFile}
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </Box>
              <Box width="40%" p={1}>
                <Controller
                  name="country"
                  render={({ field }) => (
                    <CountryAutoComplete
                      label={t('pages.editManageCaravan.tutoredUser.country')}
                      setState={setTutoredUserCountry}
                      {...field}
                      inputProps={{
                        error: errors?.country,
                        required: true,
                      }}
                      disabled={onlyFile}
                    />
                  )}
                  defaultValue="BR"
                  control={control}
                  rules={{ required: true }}
                />
              </Box>
              <Box width="20%" p={1}>
                <Controller
                  name="idNumber"
                  render={({ field }) => (
                    <ConditionalMaskField
                      condition={tutoredUserCountry === 'BR'}
                      maskFieldProps={{
                        mask: FormUtils.RGMask,
                        error: errors?.idNumber,
                      }}
                      textFieldProps={{
                        error: errors?.idNumber,
                      }}
                      label={t('pages.editManageCaravan.tutoredUser.idNumber')}
                      {...field}
                      required
                      disabled={onlyFile}
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </Box>
              <Box width="20%" p={1}>
                <Controller
                  name="cellPhone"
                  render={({ field }) => (
                    <ConditionalMaskField
                      condition={tutoredUserCountry === 'BR'}
                      maskFieldProps={{
                        mask: FormUtils.cellPhoneMask,
                        error: errors?.cellPhone,
                      }}
                      label={t('pages.editManageCaravan.tutoredUser.cellPhone')}
                      {...field}
                      disabled={onlyFile}
                    />
                  )}
                  control={control}
                />
              </Box>
              <Box width="20%" p={1}>
                <Controller
                  name="birthDate"
                  render={({ field }) => (
                    <DatePickerW
                      label={t('pages.editManageCaravan.tutoredUser.birthDate')}
                      {...field}
                      error={errors?.birthDate}
                      required
                      disableFuture
                      disabled={onlyFile}
                    />
                  )}
                  control={control}
                  defaultValue={null}
                  rules={{ required: true }}
                />
              </Box>
              {differenceInYears(new Date(), Date.parse(birthDate)) < 18 && (
                <>
                  <TypographyURL
                    urlType="secondary"
                    onClick={() => {
                      setTermName('authorization-term');
                      setOpen(true);
                    }}
                    display="inline"
                    p={0.5}
                    pr={0}
                  >
                    {t('pages.editManageCaravan.tutoredUser.authorizationTerm')}
                  </TypographyURL>
                  <BoxW p={1} width="100%">
                    <DropzoneAreaW
                      initialFiles={initialFile}
                      dropzoneText={t('pages.editManageCaravan.tutoredUser.dropzoneText')}
                      onChange={(files) => setUploadedFile(files[0])}
                      acceptedFiles={['application/pdf']}
                    />
                  </BoxW>
                </>
              )}
            </Box>
          </Form>
        }
      />
    </>
  );
};

export default InsertTutoredUserDialog;
