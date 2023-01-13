import React, { useState } from 'react';
import { Box, FormControlLabel, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordStrengthBar from 'react-password-strength-bar';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { ReactComponent as OrcidIcon } from '../../../assets/image/orcid-brands.svg';
import Form from '../../../components/form-components/Form';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import ButtonW from '../../../components/wrapper/ButtonW';
import FormUtils from '../../../utils/FormUtils';
import UserService from '../../../services/UserService';
import SocialButton, { GITHUB, GOOGLE } from '../../../components/social-button/SocialButton';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import TitleCard from '../../../components/title-card/TitleCard';
import ShowHidePassword from '../../../components/form-components/ShowHidePassword';
import useInstitution from '../../../components/hook/useInstitution';
import useLocation from '../../../components/hook/useLocation';
import useFormUtils from '../../../components/hook/useFormUtils';
import ConditionalMaskField from '../../../components/form-components/ConditionalMaskField';
import ConditionStateAutoComplete from '../../../components/form-components/ConditionStateAutoComplete';
import ConditionCityAutoComplete from '../../../components/form-components/ConditionCityAutoComplete';
import CountryAutoComplete from '../../../components/form-components/CountryAutoComplete';
import InstitutionAutoComplete from '../../../components/form-components/InstitutionAutoComplete';
import IconSvg from '../../../components/icon-svg-styles/IconSvg';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import SpecialNeedsAutoComplete from '../../../components/form-components/SpecialNeedsAutoComplete';
import SpecialNeedsType from '../../../enums/SpecialNeedsType';
import BoxW from '../../../components/wrapper/BoxW';
import CustomTopbar from '../../../components/layouts/custom-topbar/CustomTopbar';
import { TypographyURL } from '../../../components/context/ThemeChangeContext';
import TermDialog from '../../terms/TermDialog';
import HelmetW from '../../../components/wrapper/HelmetW';
import Gender from '../../../enums/Gender';
import GenderSelector from '../../../components/form-components/GenderSelector';

const AutoRegistration = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const history = useHistory();
  const { getInstitutionById } = useInstitution();
  const { monitorCEP } = useLocation();
  const { validateMask, scoreWords, validateUnique } = useFormUtils();

  const [country, setCountry] = useState('BR');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [bibliographyState, setBibliographyState] = useState(undefined);
  const [agreement, setAgreement] = useState(false);

  const [termName, setTermName] = useState(undefined);
  const [open, setOpen] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required(),
    tagName: yup.string().required(),
    email: yup
      .string()
      .required()
      .email()
      .test('unique', '', (value) => validateUnique(UserService, 'email', value, 'email')),
    github: yup.string().ensure().url(),
    linkedin: yup.string().ensure().url(),
    orcid: yup.string().ensure().url(),
    lattes: yup.string().ensure().url(),
    website: yup.string().ensure().url(),
    gender: yup.number(),
    country: yup.string().required(),
    zipCode: yup
      .string()
      .test('match', '', (value) => validateMask(value, country))
      .required(),
    state: yup.string().required(),
    city: yup.string().required(),
    addressLine1: yup.string().required(),
    addressLine2: yup.string().ensure(),
    cellPhone: yup
      .string()
      .ensure()
      .test('match', '', (value) => validateMask(value, country)),
    phone: yup
      .string()
      .ensure()
      .test('match', '', (value) => validateMask(value, country)),
    password: yup
      .string()
      .ensure()
      .required()
      .test('passwordMin', '', (value) => value.length >= 8)
      // eslint-disable-next-line no-use-before-define
      .test('passwordStrength', '', () => validatePasswordStrength()),
    passwordConfirmation: yup
      .string()
      .ensure()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('matchPassword', '', (value) => validateEqualPassword(value)),
  });

  const { control, handleSubmit, setValue, formState, watch, getValues } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  function validatePasswordStrength() {
    return passwordStrength > 1;
  }

  function validateEqualPassword(value) {
    const confirmation = getValues('password');
    return value === confirmation || confirmation == null || value == null;
  }

  const { errors } = formState;

  const otherCheck = watch('needsTypes', []);

  const handleOthers = () => otherCheck.find((o) => SpecialNeedsType.getValue('OTHERS') === o) === undefined;

  const handleSave = (formUser) => {
    const form = FormUtils.removeEmptyFields(formUser);
    form.confirmed = false;
    form.enabled = true;
    form.admin = false;
    form.institution = getInstitutionById(form.institution);
    form.bibliography = bibliographyState;
    UserService.autoRegistration(form).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.save'), type: 'success' });
        history.push('/login');
      } else if (response.status >= 400 && response.status <= 500) {
        addToast({ body: t('toastes.saveError'), type: 'error' });
      }
    });
  };

  return (
    <>
      <CustomTopbar hasArrowBack applicationName={t('general.applicationName')} />
      <HelmetW title={t('pages.autoRegistration.toolbar.newUser')} />
      <TermDialog termName={termName} open={open} onClose={() => setOpen(false)} dialogProps={{ maxWidth: 'xl' }} />
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '600px',
          position: 'relative',
          top: 32,
          left: 0,
        }}
      >
        <Box
          sx={{
            width: '70%',
            height: '100%',
            minWidth: '300px',
            minHeight: '300px',
          }}
        >
          <TitleCard title={t('pages.autoRegistration.toolbar.newUser')} cardProps={{ elevation: 8 }} boxProps={{ p: 1 }}>
            <Form name="autoRegistrationForm" onSubmit={handleSubmit(handleSave)}>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                <BoxW display="flex" justifyContent="center" flexWrap="wrap" p={1} marginBottom={2} width="100%">
                  <BoxW width="20%">
                    <SocialButton variant={GITHUB}>{t('pages.autoRegistration.gitHub')}</SocialButton>
                  </BoxW>
                  <BoxW width="20%">
                    <SocialButton variant={GOOGLE}>{t('pages.autoRegistration.google')}</SocialButton>
                  </BoxW>
                </BoxW>
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
                <BoxW width="20%" p={1} minWidth="200px">
                  <Controller
                    name="github"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.autoRegistration.github')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        prefix={<GitHubIcon />}
                        error={errors?.github}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
                <BoxW width="20%" p={1} minWidth="200px">
                  <Controller
                    name="linkedin"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.autoRegistration.linkedin')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        prefix={<LinkedInIcon />}
                        error={errors?.linkedin}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
                <BoxW width="20%" p={1} minWidth="200px">
                  <Controller
                    name="lattes"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.autoRegistration.lattes')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        prefix={<AccountBoxIcon />}
                        error={errors?.lattes}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
                <BoxW width="20%" p={1} minWidth="200px">
                  <Controller
                    name="orcid"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.autoRegistration.orcid')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        prefix={<IconSvg component={OrcidIcon} />}
                        error={errors?.orcid}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
                <BoxW width="20%" p={1} minWidth="200px">
                  <Controller
                    name="website"
                    render={({ field }) => (
                      <TextFieldW
                        label={t('pages.autoRegistration.website')}
                        inputProps={{
                          autoCapitalize: 'none',
                        }}
                        {...field}
                        prefix={<WebIcon />}
                        error={errors?.website}
                      />
                    )}
                    control={control}
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
                        label={t('pages.autoRegistration.country')}
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
                          error: errors?.zipCode,
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
                <BoxW p={1} width="100%">
                  <Controller
                    name="bibliography"
                    render={({ field }) => (
                      <MUIRichTextEditorW
                        media={false}
                        label={t('pages.autoRegistration.biography')}
                        defaultValue={field.value}
                        setDescriptionState={setBibliographyState}
                      />
                    )}
                    control={control}
                  />
                </BoxW>
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
                <BoxW width="25%" p={1}>
                  <Controller
                    name="password"
                    render={({ field }) => (
                      <ShowHidePassword
                        label={t('pages.autoRegistration.password.password')}
                        {...field}
                        error={errors?.password}
                        required
                      />
                    )}
                    control={control}
                    rules={{ required: true }}
                  />
                  <PasswordStrengthBar
                    password={watch('password', '')}
                    minLength={8}
                    scoreWords={scoreWords}
                    shortScoreWord={t('pages.autoRegistration.password.tooShort')}
                    onChangeScore={(score) => setPasswordStrength(score)}
                  />
                </BoxW>
                <BoxW width="25%" alignSelf="flex-start" p={1}>
                  <Controller
                    name="passwordConfirmation"
                    render={({ field }) => (
                      <ShowHidePassword
                        label={t('pages.autoRegistration.password.passwordConfirmation')}
                        {...field}
                        error={errors?.passwordConfirmation}
                        required
                      />
                    )}
                    control={control}
                    rules={{ required: true }}
                  />
                </BoxW>
                <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
                  <Controller
                    name="emailCommunication"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<CheckboxW checked={watch('emailCommunication', true)} primary {...field} />}
                        label={t('pages.autoRegistration.allowEmail')}
                        labelPlacement="end"
                      />
                    )}
                    /* eslint-disable-next-line react/jsx-boolean-value */
                    defaultValue={true}
                    control={control}
                  />
                </BoxW>
                <BoxW
                  display="flex"
                  flexDirection="row"
                  p={1}
                  justifyContent="flex-start"
                  width="100%"
                  alignItems="center"
                  marginLeft="-11px"
                  flexWrap="wrap"
                >
                  <CheckboxW checked={agreement} onChange={(e) => setAgreement(e.target.checked)} primary />
                  <Typography flexDirection="row" display="inline" p={0.5} pl={0} noWrap>
                    {t('pages.autoRegistration.terms.useTermAgreement')}
                  </Typography>
                  <TypographyURL
                    urlType="secondary"
                    onClick={() => {
                      setTermName('use-term');
                      setOpen(true);
                    }}
                    display="inline"
                    p={0.5}
                    pr={0}
                    noWrap
                  >
                    {t('pages.autoRegistration.terms.useTerm')}
                  </TypographyURL>
                  <Typography flexDirection="row" display="inline" p={0.5} noWrap>
                    {t('pages.autoRegistration.terms.privacyPolicyAgreement')}
                  </Typography>
                  <TypographyURL
                    urlType="secondary"
                    onClick={() => {
                      setTermName('privacy-policy');
                      setOpen(true);
                    }}
                    display="inline"
                    p={0.5}
                    pr={0}
                    noWrap
                  >
                    {t('pages.autoRegistration.terms.privacyPolicy')}
                  </TypographyURL>
                  <Typography flexDirection="row" display="inline" p={0.5} noWrap>
                    {t('pages.autoRegistration.terms.and')}
                  </Typography>
                  <TypographyURL
                    urlType="secondary"
                    onClick={() => {
                      setTermName('image-term');
                      setOpen(true);
                    }}
                    display="inline"
                    p={0.5}
                    noWrap
                  >
                    {t('pages.autoRegistration.terms.imageTerm')}
                  </TypographyURL>
                </BoxW>
                <BoxW display="flex" flexDirection="row" p={1} flexWrap="wrap" width="100%" justifyContent="center">
                  <BoxW p={1} width="25%">
                    <ButtonW fullWidth primary type="submit" disabled={!agreement}>
                      {t('pages.autoRegistration.save')}
                    </ButtonW>
                  </BoxW>
                </BoxW>
              </BoxW>
            </Form>
          </TitleCard>
        </Box>
      </Box>
    </>
  );
};

export default AutoRegistration;
