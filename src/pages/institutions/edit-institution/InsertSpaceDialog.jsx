import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Form from '../../../components/form-components/Form';
import FormUtils from '../../../utils/FormUtils';

const InsertSpaceDialog = (props) => {
  const { openDialog, setOpenDialog, formData, handleInsert, dataIndex } = props;

  const { t } = useTranslation();

  const id = formData?.id;

  const schema = yup.object().shape({
    name: yup.string().required(),
    number: yup.string().required(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const { errors } = formState;

  const handleInsertContent = (contentForm) => {
    const form = FormUtils.removeEmptyFields(contentForm);
    handleInsert(form, dataIndex);
    setOpenDialog(false);
  };

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={id ? t('pages.editInstitution.updateDialogTitle') : t('pages.editInstitution.insertDialogTitle')}
      buttonText={t('pages.editInstitution.cancelInsertDialog')}
      buttonOnClick={handleSubmit(handleInsertContent)}
      content={
        <Form name="promotionForm" onSubmit={handleSubmit(handleInsertContent)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            {id && (
              <Box width="10%" p={1}>
                <Controller
                  name="id"
                  render={({ field }) => <TextFieldW label={t('pages.editInstitution.id')} {...field} disabled />}
                  defaultValue={id}
                  control={control}
                />
              </Box>
            )}
            <Box width={id ? '70%' : '80%'} p={1}>
              <Controller
                name="name"
                render={({ field }) => (
                  <TextFieldW label={t('pages.editInstitution.columns.name')} {...field} error={errors?.name} required />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="20%" p={1}>
              <Controller
                name="number"
                render={({ field }) => (
                  <TextFieldW label={t('pages.editInstitution.columns.number')} {...field} error={errors?.number} required />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>
          </Box>
        </Form>
      }
    />
  );
};

export default InsertSpaceDialog;
