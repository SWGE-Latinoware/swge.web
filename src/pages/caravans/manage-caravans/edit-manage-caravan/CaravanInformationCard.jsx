import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import TextFieldW from '../../../../components/wrapper/TextFieldW';
import CaravanType from '../../../../enums/CaravanType';
import FoldingAccordion from '../../../../components/folding-accordion/FoldingAccordion';
import useLocation from '../../../../components/hook/useLocation';

const CaravanInformationCard = (props) => {
  const { formData } = props;

  const { t } = useTranslation();
  const { getCountryName, formatCurrencySymbol } = useLocation();
  const { control, setValue } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    _.forOwn(formData, (value, key) => {
      setValue(key, value);
    });
  }, [formData, setValue]);

  return (
    <FoldingAccordion
      title={t('pages.editManageCaravan.caravanInformation')}
      // expanded
      panels={[
        <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          <Box width="10%" p={1}>
            <Controller
              name="id"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.id')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="40%" p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.name')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="50%" p={1}>
            <Controller
              name="institution"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.institution')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="50%" p={1}>
            <Controller
              name="country"
              render={({ field }) => (
                <TextFieldW label={t('pages.editManageCaravan.country')} {...field} value={getCountryName(field.value)} readOnly />
              )}
              control={control}
            />
          </Box>
          <Box width="50%" p={1}>
            <Controller
              name="state"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.state')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="50%" p={1}>
            <Controller
              name="city"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.city')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="50%" p={1}>
            <Controller
              name="coordinator"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.coordinator')} {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="15%" p={1}>
            <Controller
              name="vacancies"
              render={({ field }) => <TextFieldW label={t('pages.editManageCaravan.vacancies')} type="number" {...field} readOnly />}
              control={control}
            />
          </Box>
          <Box width="15%" p={1}>
            <Controller
              name="remainingVacancies"
              render={({ field }) => (
                <TextFieldW label={t('pages.editManageCaravan.remainingVacancies')} type="number" {...field} readOnly />
              )}
              control={control}
            />
          </Box>
          <Box width="15%" p={1}>
            <Controller
              name="price"
              render={({ field }) => (
                <TextFieldW label={t('pages.editManageCaravan.price')} type="number" prefix={formatCurrencySymbol} {...field} readOnly />
              )}
              control={control}
            />
          </Box>
          <Box width="15%" p={1}>
            <Controller
              name="type"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.editManageCaravan.type')}
                  {...field}
                  value={t(`enums.caravanTypes.${CaravanType.getKey(field.value)}`)}
                  readOnly
                />
              )}
              control={control}
            />
          </Box>
          <Box width="20%" p={1}>
            <Controller
              name="payed"
              render={({ field }) => `${t('pages.editCaravan.payed')}: ${t(`enums.payed.${field.value ? 'PAYED' : 'NOT_PAYED'}`)}`}
              defaultValue={false}
              control={control}
            />
          </Box>
        </Box>,
      ]}
    />
  );
};

export default CaravanInformationCard;
