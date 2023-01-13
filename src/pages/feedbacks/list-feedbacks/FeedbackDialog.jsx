import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import Form from '../../../components/form-components/Form';
import FormUtils from '../../../utils/FormUtils';
import FeedbackStatus from '../../../enums/FeedbackStatus';
import FeedbackStatusSelector from '../../../components/form-components/FeedbackStatusSelector';
import ButtonW from '../../../components/wrapper/ButtonW';
import useRTE from '../../../components/hook/useRTE';
import BoxW from '../../../components/wrapper/BoxW';

const FeedbackDialog = (props) => {
  const { openDialog, setOpenDialog, formData, handleInsert, handleDownload } = props;

  const { t } = useTranslation();
  const { renderFromState } = useRTE();

  const id = formData?.id;

  const schema = yup.object().shape({
    status: yup.number().required(),
  });

  const { control, handleSubmit, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      ...formData,
      status: formData && FeedbackStatus.getValue(formData.status),
    },
  });

  const { errors } = formState;

  const handleInsertFeedback = (promotionForm) => {
    const form = FormUtils.removeEmptyFields(promotionForm);
    handleInsert(form);
    setOpenDialog(false);
  };

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={t('pages.feedbackList.insertDialogTitle')}
      buttonText={t('pages.feedbackList.cancelInsertDialog')}
      buttonOnClick={handleSubmit(handleInsertFeedback)}
      content={
        <Form name="feedbackForm" onSubmit={handleSubmit(handleInsertFeedback)}>
          <BoxW display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px" alignItems="center">
            {id && (
              <BoxW width="10%" p={1} minWidth="100px">
                <Controller
                  name="id"
                  render={({ field }) => <TextFieldW label={t('pages.feedbackList.id')} {...field} disabled />}
                  defaultValue={id}
                  control={control}
                />
              </BoxW>
            )}
            <BoxW width="50%" p={1}>
              <Controller
                name="title"
                render={({ field }) => <TextFieldW label={t('pages.feedbackList.columns.title')} {...field} disabled />}
                control={control}
              />
            </BoxW>
            <BoxW width="20%" p={1} minWidth="200px">
              <Controller
                name="status"
                render={({ field }) => (
                  <FeedbackStatusSelector label={t('pages.feedbackList.columns.status')} {...field} error={errors?.status} required />
                )}
                defaultValue={FeedbackStatus.getValue('OPEN')}
                control={control}
                rules={{ required: true }}
              />
            </BoxW>
            <BoxW width="20%" p={1}>
              <Controller
                name="file"
                render={({ field }) => (
                  <ButtonW fullWidth primary onClick={() => handleDownload(field.value)} disabled={!field.value}>
                    {t('pages.feedbackList.tooltip.download')}
                  </ButtonW>
                )}
                defaultValue={null}
                control={control}
              />
            </BoxW>
            <BoxW width="100%" p={1}>
              <Controller name="description" render={({ field }) => renderFromState(field.value)} defaultValue={null} control={control} />
            </BoxW>
          </BoxW>
        </Form>
      }
    />
  );
};

export default FeedbackDialog;
