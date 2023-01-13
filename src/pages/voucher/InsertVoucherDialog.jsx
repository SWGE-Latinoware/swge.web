import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDialog from '../../components/custom-dialog/CustomDialog';
import TextFieldW from '../../components/wrapper/TextFieldW';
import Form from '../../components/form-components/Form';
import FormUtils from '../../utils/FormUtils';
import { useEditionChange } from '../../components/context/EditionChangeContext';
import VoucherService from '../../services/VoucherService';
import { useToast } from '../../components/context/toast/ToastContext';

const InsertVoucherDialog = (props) => {
  const { openDialog, setOpenDialog, formData } = props;
  const { addToast } = useToast();

  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();

  const id = formData?.id;

  const schema = yup.object().shape({
    userEmail: yup.string().required().email(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const { errors } = formState;

  const handleInsertContent = (contentForm) => {
    const form = FormUtils.removeEmptyFields(contentForm);
    form.edition = id ? formData.edition : currentEdition;
    if (id) {
      VoucherService.update(form).then((resp) => {
        if (resp.status === 200) {
          addToast({ body: t('toastes.save'), type: 'success' });
          setOpenDialog(false);
        } else {
          addToast({ body: t('toastes.voucherError'), type: 'error' });
        }
      });
    } else {
      VoucherService.create(form).then((resp) => {
        if (resp.status === 200) {
          addToast({ body: t('toastes.save'), type: 'success' });
          setOpenDialog(false);
        } else {
          addToast({ body: t('toastes.voucherError'), type: 'error' });
        }
      });
    }
  };

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={id ? t('pages.voucherList.updateDialogTitle') : t('pages.voucherList.insertDialogTitle')}
      buttonText={t('pages.voucherList.saveDialog')}
      buttonOnClick={handleSubmit(handleInsertContent)}
      content={
        <Form name="voucherForm" onSubmit={handleSubmit(handleInsertContent)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            {id && (
              <Box width="10%" p={1}>
                <Controller
                  name="id"
                  render={({ field }) => <TextFieldW label={t('pages.voucherList.columns.id')} {...field} disabled />}
                  defaultValue={id}
                  control={control}
                />
              </Box>
            )}
            <Box width={id ? '90%' : '100%'} p={1}>
              <Controller
                name="userEmail"
                render={({ field }) => (
                  <TextFieldW label={t('pages.voucherList.columns.userEmail')} {...field} error={errors?.userEmail} required />
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

export default InsertVoucherDialog;
