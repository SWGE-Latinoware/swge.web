import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isBefore, isEqual, parseISO } from 'date-fns';
import { Add } from '@mui/icons-material';
import _ from 'lodash';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import ButtonW from '../../../components/wrapper/ButtonW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import DateTimePickerW from '../../../components/wrapper/DateTimePickerW';
import List from '../../../components/list/List';
import useLocation from '../../../components/hook/useLocation';
import InsertPromotionDialog from './InsertPromotionDialog';
import FormUtils from '../../../utils/FormUtils';
import RegistrationTypeService from '../../../services/RegistrationTypeService';
import { useToast } from '../../../components/context/toast/ToastContext';
import EditionService from '../../../services/EditionService';

const ConfigRegistrationForm = () => {
  const { t } = useTranslation();
  const { currentEdition, setUpdateEdition } = useEditionChange();
  const { formatLocaleString, formatCurrencySymbol } = useLocation();
  const { addToast } = useToast();

  const id = currentEdition?.registrationType?.id;

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPromotionData, setEditPromotionData] = useState(null);

  const columns = useMemo(
    () => [
      {
        name: 'initialDateTime',
        label: t('pages.registrationList.configForm.columns.initialDateTime'),
        options: {
          filter: true,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'finalDateTime',
        label: t('pages.registrationList.configForm.columns.finalDateTime'),
        options: {
          filter: true,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'percentage',
        label: t('pages.registrationList.configForm.columns.percentage'),
        options: {
          filter: false,
        },
      },
      {
        name: 'vacancies',
        label: t('pages.registrationList.configForm.columns.vacancies'),
        options: {
          filter: false,
          customBodyRender: (vacancies) => (vacancies == null || vacancies === '' ? '-' : vacancies),
        },
      },
    ],
    [formatLocaleString, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.registrationList.tooltip.add')}>
        <IconButton
          onClick={() => {
            setEditPromotionData(null);
            setOpenDialog(true);
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    ),
    onRowClick: (rowData, rowMeta) => {
      setEditPromotionData({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenDialog(true);
    },
  };

  const schema = yup.object().shape({
    price: yup.number().min(0).required(),
    initialDateTime: yup.date().required(),
    finalDateTime: yup
      .date()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minDate', '', () => validateFinalDateMin()),
  });

  const { control, handleSubmit, formState, watch, getValues, setValue } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function validateFinalDateMin() {
    const initialDate = getValues('initialDateTime');
    const finalDate = getValues('finalDateTime');
    return isEqual(initialDate, finalDate) || isBefore(initialDate, finalDate);
  }

  useEffect(() => {
    if (currentEdition && id != null) {
      const type = currentEdition.registrationType;
      _.forOwn(type, (value, key) => {
        switch (key) {
          case 'finalDateTime':
          case 'initialDateTime':
            setValue(key, parseISO(value));
            return;
          default:
            setValue(key, value);
        }
      });
      if (type.promotions) {
        const promotions = type.promotions
          .filter((promotion) => !promotion.isVoucher)
          .map((promotion) => {
            const newPromotion = _.clone(promotion);
            newPromotion.initialDateTime = parseISO(promotion.initialDateTime);
            newPromotion.finalDateTime = parseISO(promotion.finalDateTime);
            return newPromotion;
          });

        setData(promotions);
      }
    }
  }, [currentEdition, id, setValue]);

  const handleSave = (formRegistrationType) => {
    const form = FormUtils.removeEmptyFields(formRegistrationType);
    form.promotions = data;
    if (id) {
      form.id = id;
      if (form.promotions.length > 0) {
        form.promotions.forEach((promotion) => {
          // eslint-disable-next-line no-param-reassign
          promotion.registrationType = { id };
        });
      }
      RegistrationTypeService.update(form).then((response) => {
        if (response.status === 200) {
          setUpdateEdition(true);
          addToast({ body: t('toastes.update'), type: 'success' });
        } else if (response.status >= 400 && response.status <= 500) {
          addToast({ body: t('toastes.saveError'), type: 'error' });
        }
      });
      return;
    }
    RegistrationTypeService.create(form).then((response) => {
      if (response.status === 200) {
        currentEdition.registrationType = { id: response.data.id };
        EditionService.update(currentEdition).then((responseEdition) => {
          if (responseEdition.status === 200) {
            setUpdateEdition(true);
            addToast({ body: t('toastes.save'), type: 'success' });
            return;
          }
          addToast({ body: t('toastes.saveError'), type: 'error' });
        });
      } else if (response.status >= 400 && response.status <= 500) {
        addToast({ body: t('toastes.saveError'), type: 'error' });
      }
    });
  };

  const handleInsert = (form, dataIndex) => {
    const newData = _.clone(data);
    if (dataIndex != null) {
      _.pullAt(newData, [dataIndex]);
    }
    newData.push(form);
    setData(newData);
  };

  const handleDeletePromotions = (rowsDeleted) => {
    const rows = rowsDeleted.data.map((d) => d.dataIndex);
    _.pullAt(data, rows);
    setData(_.clone(data));
  };

  return (
    <>
      {openDialog && (
        <InsertPromotionDialog
          {...{
            openDialog,
            setOpenDialog,
            handleInsert,
          }}
          formData={editPromotionData?.data}
          dataIndex={editPromotionData?.index}
          registrationTypeInitialDateTime={watch('initialDateTime')}
          registrationTypeFinalDateTime={watch('finalDateTime')}
        />
      )}
      <StyledCard elevation={4}>
        <Form name="configRegistrationForm" onSubmit={handleSubmit(handleSave)}>
          <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
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
                    label={t('pages.registrationList.configForm.initialDateTime')}
                    {...field}
                    error={errors?.initialDateTime}
                    required
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
                    label={t('pages.registrationList.configForm.finalDateTime')}
                    {...field}
                    error={errors?.finalDateTime}
                    required
                    minDateTime={watch('initialDateTime', null)}
                  />
                )}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />
            </Box>
            <Box width="15%" p={1}>
              <Controller
                name="price"
                render={({ field }) => (
                  <TextFieldW
                    label={t('pages.registrationList.configForm.price')}
                    type="number"
                    prefix={formatCurrencySymbol}
                    {...field}
                    error={errors?.price}
                    required
                  />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Box>
            <Box width="100%" p={1}>
              <List
                title={t('pages.registrationList.configForm.tableOptions.title')}
                {...{
                  columns,
                  options,
                  data,
                  setData,
                }}
                textLabelsCod="registrationList.configForm"
                onRowsDeleteErrorToast="toastes.deleteErrors"
                onRowsDeleteToast="toastes.deletes"
                onRowsDeleteOk={handleDeletePromotions}
                defaultSortOrder={{ name: 'initialDateTime', direction: 'desc' }}
              />
            </Box>
            <Box display="flex" flexDirection="row" p={1} width="100%" justifyContent="center">
              <Box p={1} width="25%">
                <ButtonW fullWidth primary type="submit">
                  {t('pages.editActivity.save')}
                </ButtonW>
              </Box>
            </Box>
          </Box>
        </Form>
      </StyledCard>
    </>
  );
};

export default ConfigRegistrationForm;
