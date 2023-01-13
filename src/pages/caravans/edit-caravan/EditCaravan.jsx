import React, { useCallback, useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import CaravanService from '../../../services/CaravanService';
import CaravanType from '../../../enums/CaravanType';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import EditionService from '../../../services/EditionService';
import useInstitution from '../../../components/hook/useInstitution';
import ConditionStateAutoComplete from '../../../components/form-components/ConditionStateAutoComplete';
import ConditionCityAutoComplete from '../../../components/form-components/ConditionCityAutoComplete';
import CountryAutoComplete from '../../../components/form-components/CountryAutoComplete';
import InstitutionAutoComplete from '../../../components/form-components/InstitutionAutoComplete';
import AutoCompleteW from '../../../components/wrapper/AutoCompleteW';
import Selector from '../../../components/form-components/Selector';
import BoxW from '../../../components/wrapper/BoxW';
import useFormUtils from '../../../components/hook/useFormUtils';
import { useFlux } from '../../../components/context/FluxContext';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_INSTITUTION, USER_LIST } from '../../../components/form-generic/FormDialog';
import useLocation from '../../../components/hook/useLocation';

const EditCaravan = (props) => {
  const { isInternalPage = false, id: internalID } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { id: idURL } = useParams();
  const { currentEdition } = useEditionChange();
  const { getInstitutionById } = useInstitution();
  const { validateUniqueEdition } = useFormUtils();
  const { usersUpdateDate } = useFlux();
  const { formatCurrencySymbol } = useLocation();

  const id = isInternalPage ? internalID : idURL;

  const [country, setCountry] = useState('BR');
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required()
      .test('unique', '', (value) =>
        validateUniqueEdition(CaravanService, 'name', value, 'name', currentEdition?.id, originalUniqueValues?.name === value)
      ),
    coordinator: yup.number().required(),
    vacancies: yup.number().integer().min(0).required(),
    price: yup.number().min(0).required(),
    institution: yup.number().required(),
    country: yup.string().required(),
    state: yup.string().ensure(),
    city: yup.string().ensure(),
    payed: id && yup.boolean().required(),
    type: yup.number().required(),
  });

  const { control, handleSubmit, setValue, formState, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const editionInForm = watch('edition', null);

  const caravanEnrollments = watch('caravanEnrollments', []);
  const caravanTutoredEnrollments = watch('caravanTutoredEnrollments', []);

  const { errors } = formState;

  const prepareSave = (genericForm) => {
    const form = genericForm;
    form.coordinator = coordinatorList.find((coordinator) => coordinator.id === form.coordinator);
    form.institution = getInstitutionById(form.institution);
    form.edition = currentEdition;
    if (!id) {
      form.payed = false;
    }
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
          case 'type':
            setValue(key, CaravanType.getValue(value));
            return;
          case 'coordinator':
            setValue(key, value.id);
            return;
          case 'institution':
            setValue(key, value.id);
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [setValue]
  );

  useEffect(() => {
    let editionID = null;
    if (id) {
      if (editionInForm == null) {
        return;
      }
      editionID = editionInForm;
    } else {
      if (currentEdition == null) {
        setCoordinatorList([]);
        return;
      }
      editionID = currentEdition.id;
    }
    EditionService.findAllCoordinators(editionID).then((response) => {
      if (response.status === 200) {
        setCoordinatorList(response.data);
        return;
      }
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, currentEdition, editionInForm, id, t, usersUpdateDate]);

  return (
    <>
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} link={link} linkProps={{ isInternalPage: true }} />
      <FormGenerics
        title={[
          t('layouts.sidebar.records'),
          { title: t('layouts.sidebar.caravans'), url: '/cli/caravans' },
          t(`pages.editCaravan.toolbar.${id ? 'editCaravan' : 'newCaravan'}`),
        ]}
        goBack="/cli/caravans"
        id={id}
        defaultService={CaravanService}
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
                render={({ field }) => <TextFieldW label={t('pages.editCaravan.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={id ? '40%' : '50%'} p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editCaravan.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="institution"
              render={({ field }) => (
                <>
                  <InstitutionAutoComplete
                    label={t('pages.editCaravan.institution')}
                    {...field}
                    inputProps={{
                      error: errors?.institution,
                      required: true,
                    }}
                    setOpenDialog={setOpenDialog}
                    setLink={setLink}
                    link={EDIT_INSTITUTION}
                  />
                </>
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="country"
              render={({ field }) => (
                <CountryAutoComplete
                  label={t('pages.editCaravan.country')}
                  setState={setCountry}
                  {...field}
                  inputProps={{
                    error: errors?.country,
                    required: true,
                  }}
                />
              )}
              defaultValue="BR"
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="state"
              render={({ field }) => (
                <ConditionStateAutoComplete condition={country === 'BR'} label={t('pages.editCaravan.state')} {...field} />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="city"
              render={({ field }) => (
                <ConditionCityAutoComplete
                  condition={country === 'BR'}
                  label={t('pages.editCaravan.city')}
                  {...field}
                  watch={watch}
                  setValue={setValue}
                />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="coordinator"
              render={({ field }) => (
                <AutoCompleteW
                  label={t('pages.editCaravan.coordinator')}
                  {...field}
                  options={coordinatorList.map((coordinador) => coordinador.id)}
                  getOptionLabel={(o) => o && coordinatorList.find((coordinator) => coordinator.id === o).name}
                  linkProps={{ id: 1, isInternalPage: true }}
                  inputProps={{
                    error: errors?.coordinator,
                    required: true,
                  }}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={USER_LIST}
                />
              )}
              defaultValue=""
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="10%" p={1} minWidth="100px">
            <Controller
              name="vacancies"
              render={({ field }) => (
                <TextFieldW label={t('pages.editCaravan.vacancies')} type="number" {...field} error={errors?.vacancies} required />
              )}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="price"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.editCaravan.price')}
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
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="type"
              render={({ field }) => (
                <Selector
                  label={t('pages.editCaravan.type')}
                  {...field}
                  error={errors?.type}
                  required
                  disabled={caravanEnrollments?.length > 0 || caravanTutoredEnrollments?.length > 0}
                >
                  {CaravanType.enums.map((item) => (
                    <MenuItem key={item.key} value={item.value}>
                      {t(`enums.caravanTypes.${item.key}`)}
                    </MenuItem>
                  ))}
                </Selector>
              )}
              defaultValue={CaravanType.getValue('GENERAL')}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          {id && (
            <BoxW width="20%" p={1}>
              <Controller
                name="payed"
                render={({ field }) => `${t('pages.editCaravan.payed')}: ${t(`enums.payed.${field.value ? 'PAYED' : 'NOT_PAYED'}`)}`}
                defaultValue={false}
                control={control}
              />
            </BoxW>
          )}
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default EditCaravan;
