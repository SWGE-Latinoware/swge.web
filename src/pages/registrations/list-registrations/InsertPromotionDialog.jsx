import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { isAfter, isBefore, isEqual } from 'date-fns';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import DateTimePickerW from '../../../components/wrapper/DateTimePickerW';
import Form from '../../../components/form-components/Form';
import FormUtils from '../../../utils/FormUtils';

const InsertPromotionDialog = (props) => {
  const { openDialog, setOpenDialog, formData, handleInsert, dataIndex, registrationTypeInitialDateTime, registrationTypeFinalDateTime } =
    props;

  const { t } = useTranslation();

  const id = formData?.id;

  const schema = yup.object().shape({
    percentage: yup.number().min(0).required(),
    initialDateTime: yup
      .date()
      .required()
      .test(
        'registrationType',
        '',
        (value) => isAfter(value, registrationTypeInitialDateTime) && isBefore(value, registrationTypeFinalDateTime)
      ),
    finalDateTime: yup
      .date()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minDate', '', () => validateFinalDateMin())
      .test(
        'registrationType',
        '',
        (value) => isAfter(value, registrationTypeInitialDateTime) && isBefore(value, registrationTypeFinalDateTime)
      ),
    vacancies: yup
      .string()
      .ensure()
      .test('min', '', (value) => value == null || value === '' || value > 0),
  });

  const { control, handleSubmit, formState, watch, getValues } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const { errors } = formState;

  function validateFinalDateMin() {
    const initialDate = getValues('initialDateTime');
    const finalDate = getValues('finalDateTime');
    return isEqual(initialDate, finalDate) || isBefore(initialDate, finalDate);
  }

  const handleInsertPromotion = (promotionForm) => {
    const form = FormUtils.removeEmptyFields(promotionForm);
    handleInsert(form, dataIndex);
    setOpenDialog(false);
  };

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={t('pages.registrationList.configForm.insertDialogTitle')}
      buttonText={t('pages.registrationList.configForm.cancelInsertDialog')}
      buttonOnClick={handleSubmit(handleInsertPromotion)}
      content={
        <Form name="promotionForm" onSubmit={handleSubmit(handleInsertPromotion)}>
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            {id && (
              <Box width="10%" p={1}>
                <Controller
                  name="id"
                  render={({ field }) => <TextFieldW label={t('pages.registrationList.configForm.id')} {...field} disabled />}
                  defaultValue={id}
                  control={control}
                />
              </Box>
            )}
            <Box width="25%" p={1}>
              <Controller
                name="initialDateTime"
                render={({ field }) => (
                  <DateTimePickerW
                    label={t('pages.registrationList.configForm.columns.initialDateTime')}
                    {...field}
                    error={errors?.initialDateTime}
                    required
                    minDateTime={registrationTypeInitialDateTime}
                    maxDateTime={registrationTypeFinalDateTime}
                  />
                )}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />
            </Box>
            <Box width="25%" p={1}>
              <Controller
                name="finalDateTime"
                render={({ field }) => (
                  <DateTimePickerW
                    label={t('pages.registrationList.configForm.columns.finalDateTime')}
                    {...field}
                    error={errors?.finalDateTime}
                    required
                    minDateTime={watch('initialDateTime', null)}
                    maxDateTime={registrationTypeFinalDateTime}
                  />
                )}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />
            </Box>
            <Box width="15%" p={1}>
              <Controller
                name="percentage"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.registrationList.configForm.columns.percentage')}
                    type="number"
                    {...field}
                    error={errors?.percentage}
                    required
                  />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="15%" p={1}>
              <Controller
                name="vacancies"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.registrationList.configForm.columns.vacancies')}
                    type="number"
                    {...field}
                    error={errors?.vacancies}
                  />
                )}
                control={control}
              />
            </Box>
          </Box>
        </Form>
      }
    />
  );
};

export default InsertPromotionDialog;
