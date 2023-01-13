import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from '../../components/context/toast/ToastContext';
import UserService from '../../services/UserService';
import FormUtils from '../../utils/FormUtils';
import useInstitution from '../../components/hook/useInstitution';
import useFormUtils from '../../components/hook/useFormUtils';
import TitleCard from '../../components/title-card/TitleCard';
import Form from '../../components/form-components/Form';
import BoxW from '../../components/wrapper/BoxW';
import useLocation from '../../components/hook/useLocation';
import TextFieldW from '../../components/wrapper/TextFieldW';
import DatePickerW from '../../components/wrapper/DatePickerW';
import CountryAutoComplete from '../../components/form-components/CountryAutoComplete';
import ConditionalMaskField from '../../components/form-components/ConditionalMaskField';
import ConditionStateAutoComplete from '../../components/form-components/ConditionStateAutoComplete';
import ConditionCityAutoComplete from '../../components/form-components/ConditionCityAutoComplete';
import InstitutionAutoComplete from '../../components/form-components/InstitutionAutoComplete';
import SpecialNeedsAutoComplete from '../../components/form-components/SpecialNeedsAutoComplete';
import ButtonW from '../../components/wrapper/ButtonW';
import SpecialNeedsType from '../../enums/SpecialNeedsType';
import Toolbar from '../../components/toolbar/Toolbar';
import RegistrationService from '../../services/RegistrationService';
import { useEditionChange } from '../../components/context/EditionChangeContext';
import CheckboxW from '../../components/wrapper/CheckboxW';
import Gender from '../../enums/Gender';
import GenderSelector from '../../components/form-components/GenderSelector';

const UserRegistration = () => {
  const { currentEdition } = useEditionChange();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { getInstitutionById } = useInstitution();
  const { monitorCEP } = useLocation();
  const { validateMask, validateUnique } = useFormUtils();

  const [exempt, setExempt] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required(),
    tagName: yup.string().required(),
    email: yup
      .string()
      .required()
      .email()
      .test('unique', '', (value) => validateUnique(UserService, 'email', value, 'email')),
    gender: yup.number(),
    country: yup.string().required(),
    zipCode: yup
      .string()
      // eslint-disable-next-line no-use-before-define
      .test('match', '', (value) => validateMask(value, getCountry()))
      .required(),
    state: yup.string().required(),
    city: yup.string().required(),
    addressLine1: yup.string().required(),
    addressLine2: yup.string().ensure(),
    cellPhone: yup
      .string()
      .ensure()
      // eslint-disable-next-line no-use-before-define
      .test('match', '', (value) => validateMask(value, getCountry())),
    phone: yup
      .string()
      .ensure()
      // eslint-disable-next-line no-use-before-define
      .test('match', '', (value) => validateMask(value, getCountry())),
  });

  const { control, handleSubmit, setValue, formState, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const otherCheck = watch('needsTypes', []);

  const country = watch('country', 'BR');

  function getCountry() {
    return country;
  }

  const handleOthers = () => otherCheck.find((o) => SpecialNeedsType.getValue('OTHERS') === o) === undefined;

  const handleRegistration = (id) => {
    if (currentEdition && id) {
      const form = {
        edition: currentEdition,
        user: { id },
        individualRegistrations: [],
      };
      RegistrationService.create(form).then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.registrationSave'), type: 'success' });
          RegistrationService.completeUserRegistration(response.data?.id, exempt).then((regResponse) => {
            addToast(
              regResponse.status === 200
                ? { body: t(`toastes.registration${exempt ? 'Exempted' : 'Save'}`), type: 'success' }
                : { body: t('toastes.registrationSaveError'), type: 'error' }
            );
          });
        } else if (response.status >= 400 && response.status <= 500) {
          addToast({ body: t('toastes.registrationSaveError'), type: 'error' });
        }
      });
    }
  };

  const handleSave = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);
    form.confirmed = true;
    form.enabled = true;
    form.admin = false;
    form.institution = getInstitutionById(form.institution);
    form.bibliography = {
      entityMap: {},
      blocks: [{ key: '5ejm6', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }],
    };
    form.emailCommunication = true;
    form.socialCommunication = false;
    form.lattes = '';
    form.github = '';
    form.linkedin = '';
    form.orcid = '';
    form.website = '';

    form.userPermissions = [
      {
        userRole: 0,
        edition: currentEdition,
        user: undefined,
      },
    ];

    UserService.create(form).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.save'), type: 'success' });
        handleRegistration(response.data?.id);
      } else if (response.status >= 400 && response.status <= 500) {
        addToast({ body: t('toastes.saveError'), type: 'error' });
      }
    });
  };

  return (
    <>
      <Toolbar title={t('layouts.sidebar.userRegistration')} hasArrowBack />
      <Box
        p={2}
        flexDirection="row"
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        sx={{
          height: '100%',
          minWidth: '300px',
          minHeight: '300px',
        }}
      >
        <TitleCard title={t('pages.autoRegistration.toolbar.newUser')} cardProps={{ elevation: 8 }} boxProps={{ p: 1 }}>
          <Form name="autoRegistrationForm" onSubmit={handleSubmit(handleSave)}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="45%" p={1}>
                <Controller
                  name="name"
                  render={({ field }) => <TextFieldW label={t('pages.autoRegistration.name')} {...field} error={errors?.name} required />}
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width="20%" p={1} minWidth="200px">
                <Controller
                  name="tagName"
                  render={({ field }) => (
                    <TextFieldW label={t('pages.autoRegistration.cardName')} {...field} error={errors?.tagName} required />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width="35%" p={1}>
                <Controller
                  name="email"
                  render={({ field }) => (
                    <TextFieldW
                      label={t('pages.autoRegistration.email')}
                      inputProps={{
                        autoCapitalize: 'none',
                      }}
                      {...field}
                      error={errors?.email}
                      required
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width="15%" p={1} minWidth="150px">
                <Controller
                  name="gender"
                  render={({ field }) => <GenderSelector label={t('pages.autoRegistration.gender')} {...field} />}
                  defaultValue={Gender.getValue('UNDEFINED')}
                  control={control}
                />
              </BoxW>
              <BoxW width="15%" p={1} minWidth="200px">
                <Controller
                  name="birthDate"
                  render={({ field }) => <DatePickerW label={t('pages.autoRegistration.birthDate')} disableFuture {...field} />}
                  defaultValue={null}
                  control={control}
                />
              </BoxW>
              <BoxW width="45%" p={1}>
                <Controller
                  name="country"
                  render={({ field }) => (
                    <CountryAutoComplete
                      label={t('pages.myAccount.country')}
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
              <BoxW width="20%" p={1}>
                <Controller
                  name="zipCode"
                  render={({ field }) => (
                    <ConditionalMaskField
                      condition={country === 'BR'}
                      maskFieldProps={{
                        mask: FormUtils.CEPMask,
                        onChange: (e) => monitorCEP(e, setValue),
                        error: errors?.zipCode,
                        required: true,
                      }}
                      label={t('pages.autoRegistration.zipCode')}
                      {...field}
                      textFieldProps={{
                        error: errors && errors?.zipCode,
                        required: true,
                      }}
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width="50%" p={1}>
                <Controller
                  name="state"
                  render={({ field }) => (
                    <ConditionStateAutoComplete
                      condition={country === 'BR'}
                      label={t('pages.autoRegistration.state')}
                      {...field}
                      textFieldProps={{
                        error: errors?.state,
                        required: true,
                      }}
                      autoCompleteProps={{
                        inputProps: {
                          error: errors?.state,
                          required: true,
                        },
                      }}
                    />
                  )}
                  defaultValue=""
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width="50%" p={1}>
                <Controller
                  name="city"
                  render={({ field }) => (
                    <ConditionCityAutoComplete
                      condition={country === 'BR'}
                      label={t('pages.autoRegistration.city')}
                      {...field}
                      watch={watch}
                      setValue={setValue}
                      textFieldProps={{
                        error: errors?.city,
                        required: true,
                      }}
                      autoCompleteProps={{
                        inputProps: {
                          error: errors?.city,
                          required: true,
                        },
                      }}
                    />
                  )}
                  defaultValue=""
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              <BoxW width={country === 'BR' ? '100%' : '50%'} p={1}>
                <Controller
                  name="addressLine1"
                  render={({ field }) => (
                    <TextFieldW
                      label={t(`pages.autoRegistration.address${country === 'BR' ? 'Unique' : ''}`)}
                      {...field}
                      error={errors?.addressLine1}
                      required
                    />
                  )}
                  control={control}
                  rules={{ required: true }}
                />
              </BoxW>
              {country !== 'BR' && (
                <BoxW width="50%" p={1}>
                  <Controller
                    name="addressLine2"
                    render={({ field }) => <TextFieldW label={t('pages.autoRegistration.address2')} {...field} />}
                    control={control}
                  />
                </BoxW>
              )}
              <BoxW width={handleOthers() ? '34%' : '25%'} p={1}>
                <Controller
                  name="institution"
                  render={({ field }) => <InstitutionAutoComplete label={t('pages.autoRegistration.company')} {...field} />}
                  defaultValue=""
                  control={control}
                />
              </BoxW>
              <BoxW width={handleOthers() ? '33%' : '25%'} p={1}>
                <Controller
                  name="needsTypes"
                  render={({ field }) => <SpecialNeedsAutoComplete label={t('pages.autoRegistration.specialNeedsText')} {...field} />}
                  defaultValue={[]}
                  control={control}
                />
              </BoxW>
              {!handleOthers() && (
                <BoxW width="25%" p={1}>
                  <Controller
                    name="otherNeeds"
                    render={({ field }) => <TextFieldW label={t('pages.autoRegistration.otherNeeds')} {...field} />}
                    control={control}
                  />
                </BoxW>
              )}
              <BoxW width="25%" alignSelf="flex-start" p={1}>
                <Controller
                  name="cellPhone"
                  render={({ field }) => (
                    <ConditionalMaskField
                      condition={country === 'BR'}
                      maskFieldProps={{
                        mask: FormUtils.cellPhoneMask,
                        error: errors?.cellPhone,
                      }}
                      label={t('pages.autoRegistration.mobilePhone')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW width="25%" alignSelf="flex-start" p={1}>
                <Controller
                  name="phone"
                  render={({ field }) => (
                    <ConditionalMaskField
                      condition={country === 'BR'}
                      maskFieldProps={{
                        mask: FormUtils.phoneMask,
                        error: errors?.phone,
                      }}
                      label={t('pages.autoRegistration.phone')}
                      {...field}
                    />
                  )}
                  control={control}
                />
              </BoxW>
              <BoxW display="flex" flexDirection="row" p={1} flexWrap="wrap" width="100%" alignItems="center">
                <CheckboxW checked={exempt} onChange={(e) => setExempt(e.target.checked)} />
                <Typography>{t('pages.autoRegistration.exempt')}</Typography>
              </BoxW>
              <BoxW display="flex" flexDirection="row" p={1} flexWrap="wrap" width="100%" justifyContent="center">
                <BoxW p={1} width="25%">
                  <ButtonW fullWidth primary type="submit">
                    {t('pages.autoRegistration.save')}
                  </ButtonW>
                </BoxW>
              </BoxW>
            </BoxW>
          </Form>
        </TitleCard>
      </Box>
    </>
  );
};

export default UserRegistration;
