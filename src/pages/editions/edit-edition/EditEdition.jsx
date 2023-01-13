import React, { useCallback, useState } from 'react';
import { FormControlLabel, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, endOfDay, isBefore, isEqual } from 'date-fns';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import EditionService from '../../../services/EditionService';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import DateUtils from '../../../utils/DateUtils';
import Selector from '../../../components/form-components/Selector';
import EditionType from '../../../enums/EditionType';
import useInstitution from '../../../components/hook/useInstitution';
import InstitutionAutoComplete from '../../../components/form-components/InstitutionAutoComplete';
import { TypographyURL } from '../../../components/context/ThemeChangeContext';
import BoxW from '../../../components/wrapper/BoxW';
import useFormUtils from '../../../components/hook/useFormUtils';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_INSTITUTION } from '../../../components/form-generic/FormDialog';
import CheckboxW from '../../../components/wrapper/CheckboxW';

const EditEdition = (props) => {
  const { isInternalPage = false, id: internalID } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { id: idURL } = useParams();
  const { getInstitutionById } = useInstitution();
  const { validateUnique } = useFormUtils();

  const id = isInternalPage ? internalID : idURL;

  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) => validateUnique(EditionService, 'name', value, 'name', originalUniqueValues?.name === value)),
    shortName: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUnique(EditionService, 'short-name', value, 'shortName', originalUniqueValues?.shortName === value)
      ),
    initialDate: yup.date().required(),
    finalDate: yup
      .date()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minDate', '', () => validateFinalDateMin()),
    year: yup
      .number()
      .required()
      .integer()
      .positive()
      .test('unique', '', (value) => validateUnique(EditionService, 'year', value, 'year', originalUniqueValues?.year === value)),
    institution: yup.number().required(),
  });

  const { control, handleSubmit, setValue, formState, getValues, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  function validateFinalDateMin() {
    const initialDate = getValues('initialDate');
    const finalDate = getValues('finalDate');
    return isEqual(initialDate, finalDate) || isBefore(initialDate, finalDate);
  }

  const prepareSave = (genericForm) => {
    const form = genericForm;
    form.institution = getInstitutionById(form.institution);
    form.finalDate = endOfDay(form.finalDate);
    return true;
  };

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
          case 'shortName':
          case 'year':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'type':
            setValue(key, EditionType.getValue(value));
            return;
          case 'initialDate':
          case 'finalDate':
            setValue(key, new Date(value));
            return;
          case 'institution':
            setValue(key, value && value.id);
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [setValue]
  );

  return (
    <>
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} link={link} linkProps={{ isInternalPage: true }} />
      <FormGenerics
        title={[
          t('layouts.sidebar.records'),
          { title: t('layouts.sidebar.editions'), url: '/cli/editions' },
          t(`pages.editEdition.toolbar.${id ? 'editEdition' : 'newEdition'}`),
        ]}
        goBack="/cli/editions"
        id={id}
        defaultService={EditionService}
        handleSubmit={handleSubmit}
        prepareSave={prepareSave}
        prepareFind={prepareFind}
        disableToolbar={isInternalPage}
      >
        <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          {id && (
            <BoxW width="10%" p={1} minWidth="100px">
              <Controller
                name="id"
                render={({ field }) => <TextFieldW label={t('pages.editEdition.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={id ? '35%' : '45%'} p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editEdition.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="25%" p={1}>
            <Controller
              name="shortName"
              render={({ field }) => <TextFieldW label={t('pages.editEdition.shortName')} {...field} error={errors?.shortName} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="initialDate"
              render={({ field }) => (
                <DatePickerW label={t('pages.editEdition.initialDate')} {...field} error={errors?.initialDate} required />
              )}
              defaultValue={DateUtils.getCurrentDateWithoutTime()}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="finalDate"
              render={({ field }) => (
                <DatePickerW
                  minDate={watch('initialDate', new Date())}
                  label={t('pages.editEdition.finalDate')}
                  {...field}
                  error={errors?.finalDate}
                  required
                />
              )}
              defaultValue={addDays(DateUtils.getCurrentDateWithoutTime(), 1)}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="type"
              render={({ field }) => (
                <Selector label={t('pages.editEdition.editionType')} {...field} required>
                  {EditionType.enums.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                      {t(`enums.editionTypes.${item.key}`)}
                    </MenuItem>
                  ))}
                </Selector>
              )}
              defaultValue={EditionType.getValue('LIVE')}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="institution"
              render={({ field }) => (
                <InstitutionAutoComplete
                  inputProps={{
                    error: errors?.institution,
                    required: true,
                  }}
                  label={t('pages.editEdition.place')}
                  {...field}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_INSTITUTION}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="10%" p={1} minWidth="200px">
            <Controller
              name="year"
              render={({ field }) => (
                <TextFieldW label={t('pages.editEdition.year')} {...field} type="number" error={errors?.year} required />
              )}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="enabled"
              render={({ field }) => (
                <FormControlLabel
                  control={<CheckboxW checked={field.value} primary {...field} />}
                  label={t('pages.editEdition.enabled')}
                  labelPlacement="end"
                />
              )}
              defaultValue
              control={control}
            />
          </BoxW>
          {id && (
            <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
              <BoxW p={1} width="25%">
                <TypographyURL variant="body1" urlType="secondary" onClick={() => history.push(`/${getValues('year')}/cli/themes`)}>
                  {t('pages.editEdition.goToCustomization')}
                </TypographyURL>
              </BoxW>
            </BoxW>
          )}
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default EditEdition;
