import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, endOfDay, isBefore, isEqual } from 'date-fns';
import { FormControlLabel } from '@mui/material';
import validateColor from 'validate-color';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import TrackService from '../../../services/TrackService';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import DateUtils from '../../../utils/DateUtils';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import CertificateAutoComplete from '../../../components/form-components/CertificateAutoComplete';
import useCertificate from '../../../components/hook/useCertificate';
import BoxW from '../../../components/wrapper/BoxW';
import useFormUtils from '../../../components/hook/useFormUtils';
import CustomColorPicker from '../../../components/custom-color-picker/CustomColorPicker';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_CERTIFICATE } from '../../../components/form-generic/FormDialog';

const EditTrack = (props) => {
  const { isInternalPage = false, id: internalID, goBack } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { id: idURL } = useParams();
  const { currentEdition } = useEditionChange();
  const { getCertificateById } = useCertificate();
  const { validateUniqueEdition } = useFormUtils();

  const id = isInternalPage ? internalID : idURL;

  const [descriptionState, setDescriptionState] = useState(undefined);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUniqueEdition(TrackService, 'name', value, 'name', currentEdition?.id, originalUniqueValues?.name === value)
      ),
    initialDate: yup.date().required(),
    finalDate: yup
      .date()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minDate', '', () => validateFinalDateMin()),
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
    if (form.calendarColor == null) {
      form.calendarColor = undefined;
    } else if (!validateColor(form.calendarColor)) {
      addToast({ body: t('toastes.colorFieldFormat'), type: 'error' });
      return false;
    }
    form.edition = currentEdition;
    form.description = descriptionState;
    form.attendeeCertificate = getCertificateById(form.attendeeCertificate);
    form.speakerCertificate = getCertificateById(form.speakerCertificate);
    form.finalDate = endOfDay(form.finalDate);
    return true;
  };

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'initialDate':
          case 'finalDate':
            setValue(key, new Date(value));
            return;
          case 'speakerCertificate':
          case 'attendeeCertificate':
            setValue(key, (value && value.id) || '');
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
          { title: t('layouts.sidebar.tracks'), url: '/cli/tracks' },
          t(`pages.editTrack.toolbar.${id ? 'editTrack' : 'newTrack'}`),
        ]}
        goBack={goBack || '/cli/tracks'}
        id={id}
        defaultService={TrackService}
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
                render={({ field }) => <TextFieldW label={t('pages.editTrack.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={id ? '60%' : '70%'} p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editTrack.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="initialDate"
              render={({ field }) => (
                <DatePickerW label={t('pages.editTrack.initialDate')} {...field} error={errors?.initialDate} required />
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
                  label={t('pages.editTrack.finalDate')}
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
          <BoxW width="40%" p={1}>
            <Controller
              name="attendeeCertificate"
              render={({ field }) => (
                <CertificateAutoComplete
                  label={t('pages.editTrack.attendeeCertificate')}
                  {...field}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_CERTIFICATE}
                />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="40%" p={1}>
            <Controller
              name="speakerCertificate"
              render={({ field }) => (
                <CertificateAutoComplete
                  label={t('pages.editTrack.speakerCertificate')}
                  {...field}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_CERTIFICATE}
                />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW p={1}>
            <FormControlLabel
              control={
                <CustomColorPicker value={watch('calendarColor', undefined)} onChange={(color) => setValue('calendarColor', color)} />
              }
              label={t('pages.editActivity.calendarColor')}
              labelPlacement="bottom"
            />
          </BoxW>
          <BoxW p={1} width="100%">
            <Controller
              name="description"
              render={({ field }) => (
                <MUIRichTextEditorW
                  media={false}
                  label={t('pages.editTrack.description')}
                  defaultValue={field.value}
                  setDescriptionState={setDescriptionState}
                />
              )}
              control={control}
            />
          </BoxW>
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default EditTrack;
