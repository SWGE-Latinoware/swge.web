import React, { useCallback, useState } from 'react';
import { FormControlLabel, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordStrengthBar from 'react-password-strength-bar';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { ReactComponent as OrcidIcon } from '../../../assets/image/orcid-brands.svg';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import FormUtils from '../../../utils/FormUtils';
import UserService from '../../../services/UserService';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import ShowHidePassword from '../../../components/form-components/ShowHidePassword';
import useLocation from '../../../components/hook/useLocation';
import { useUserChange } from '../../../components/context/UserChangeContext';
import useInstitution from '../../../components/hook/useInstitution';
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
import UserUtils from '../../../utils/UserUtils';
import SocialButton, { GITHUB, GOOGLE } from '../../../components/social-button/SocialButton';
import FileService from '../../../services/FileService';
import ImageEditor from '../../../components/image-editor/ImageEditor';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_INSTITUTION } from '../../../components/form-generic/FormDialog';
import Gender from '../../../enums/Gender';
import GenderSelector from '../../../components/form-components/GenderSelector';

const MyAccount = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentUser, setUpdateUser, userImage, setUserImage } = useUserChange();
  const { monitorCEP } = useLocation();
  const { getInstitutionById } = useInstitution();
  const { validateMask, scoreWords, validateUnique } = useFormUtils();

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [openUntieDialog, setOpenUntieDialog] = useState(false);
  const [accountUntie, setAccountUntie] = useState(null);
  const [bibliographyState, setBibliographyState] = useState(undefined);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [userEditImage, setUserEditImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required(),
    tagName: yup.string().required(),
    email: yup
      .string()
      .required()
      .email()
      .test('unique', '', (value) => validateUnique(UserService, 'email', value, 'email', originalUniqueValues?.email === value)),
    github: yup.string().ensure().url(),
    linkedin: yup.string().ensure().url(),
    orcid: yup.string().ensure().url(),
    lattes: yup.string().ensure().url(),
    website: yup.string().ensure().url(),
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
    password: yup
      .string()
      .ensure()
      .test('required', '', (value) => (!currentUser?.alterPassword ? true : value != null && value !== ''))
      // eslint-disable-next-line no-use-before-define
      .test('passwordMin', '', () => validatePasswordMin())
      // eslint-disable-next-line no-use-before-define
      .test('passwordStrength', '', () => validatePasswordStrengthNotRequired()),
    passwordConfirmation: yup
      .string()
      .ensure()
      // eslint-disable-next-line no-use-before-define
      .test('matchPassword', '', (value) => validateEqualPasswordNotRequired(value)),
  });

  const { control, handleSubmit, setValue, formState, watch, getValues, trigger } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const country = watch('country', 'BR');

  function getCountry() {
    return country;
  }

  function validatePasswordStrengthNotRequired() {
    const password = getValues('password');
    if (password == null || password === '') {
      return true;
    }
    return passwordStrength > 1;
  }

  function validateEqualPasswordNotRequired(value) {
    const confirmation = getValues('password');
    return value === confirmation || ((confirmation == null || confirmation === '') && (value == null || value === ''));
  }

  function validatePasswordMin() {
    const password = getValues('password');
    if (password == null || password === '') {
      return true;
    }
    return password.length >= 8;
  }

  const { errors } = formState;

  const otherCheck = watch('needsTypes', []);
  const githubConnected = watch('githubConnected', false);
  const googleConnected = watch('googleConnected', false);

  const handleOthers = () => otherCheck.find((o) => SpecialNeedsType.getValue('OTHERS') === o) === undefined;

  const handleSave = useCallback(
    (formUser) => {
      const form = FormUtils.removeEmptyFields(formUser);

      form.institution = getInstitutionById(form.institution);
      form.bibliography = bibliographyState;

      if (form.password === '') {
        delete form.password;
      }

      const userImg = userImage ? getValues('userProfile') : null;

      const operation = (resp) => {
        if (resp.status === 200) {
          form.userProfile = resp.data;
          UserService.updateByUser(form).then((response) => {
            if (response.status === 200) {
              setUpdateUser(true);
              addToast({ body: t('toastes.update'), type: 'success' });
            } else if (response.status >= 400 && response.status <= 500) {
              addToast({ body: t('toastes.saveError'), type: 'error' });
            }
          });
          return;
        }

        addToast({ body: t('toastes.saveError'), type: 'error' });
      };

      if (userEditImage) {
        const formImageUpdate = new FormData();
        const imageData = userEditImage.name.split('.');
        formImageUpdate.append('name', userEditImage.name.replace(`.${imageData[imageData.length - 1]}`, ''));
        if (imageData.length > 1) {
          formImageUpdate.append('format', imageData[imageData.length - 1]);
        }
        formImageUpdate.append('file', userEditImage);

        if (userImg != null) formImageUpdate.append('id', userImg.id);

        const promise = userImg ? FileService.update(formImageUpdate) : FileService.create(formImageUpdate);
        promise.then((response) => {
          operation(response);
        });
        return;
      }

      const promise = { status: 200, data: userImg };
      operation(promise);
    },
    [addToast, bibliographyState, getInstitutionById, getValues, setUpdateUser, t, userEditImage, userImage]
  );

  const handleAccountUntie = () => {
    setOpenUntieDialog(false);
    UserService.untieSocialAccount(accountUntie, currentUser.id).then((response) => {
      if (response.status === 200) {
        setUpdateUser(true);
        setValue(`${accountUntie}Connected`, false);
        addToast({ body: t('toastes.accountUntie'), type: 'success' });
      } else if (response.status >= 400 && response.status <= 500) {
        addToast({ body: t('toastes.accountUntieError'), type: 'error' });
      }
    });
  };

  const prepareUntieDialog = (registrationId) => {
    setAccountUntie(registrationId);
    setOpenUntieDialog(true);
  };

  const prepareFind = useCallback(
    (responseData) => {
      const uniqueValues = {};
      _.forOwn(responseData, (value, key) => {
        switch (key) {
          case 'name':
          case 'tagName':
            if (UserUtils.isFakeTempName(value)) {
              setValue(key, undefined);
              return;
            }
            setValue(key, value);
            return;
          case 'email':
            if (UserUtils.isFakeTempEmail(value)) {
              uniqueValues[key] = '';
              setValue(key, undefined);
              return;
            }
            uniqueValues[key] = value;
            setValue(key, value);
            return;
          case 'gender':
            setValue(key, Gender.getValue(value));
            return;
          case 'institution':
            setValue(key, (value && value.id) || '');
            return;
          case 'needsTypes':
            setValue(key, (value && value.map((item) => SpecialNeedsType.getValue(item))) || []);
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
      if (!responseData.completed) {
        trigger();
      }
    },
    [setValue, trigger]
  );

  return (
    <>
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} link={link} linkProps={{ isInternalPage: true }} />
      <FormGenerics
        title={[{ title: t('pages.myAccount.toolbar.myAccount'), url: '/cli/my-account' }, t('pages.myAccount.toolbar.editMyAccount')]}
        id={currentUser?.id}
        defaultService={UserService}
        handleSubmit={handleSubmit}
        handleExternSave={handleSave}
        prepareFind={prepareFind}
      >
        {(githubConnected || googleConnected) && (
          <CustomDialog
            open={openUntieDialog}
            onClose={() => setOpenUntieDialog(!openUntieDialog)}
            buttonErrorOnClick={() => handleAccountUntie()}
            title={t('pages.myAccount.untieDialogTitle')}
            content={
              <BoxW p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
                <BoxW p={1}>
                  <Typography>{t('pages.myAccount.untieDialogContent')}</Typography>
                </BoxW>
              </BoxW>
            }
            buttonText={t('dialog.cancelDeleteDialog')}
            buttonErrorText={t('pages.myAccount.untie')}
          />
        )}

        <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          {(githubConnected || googleConnected) && (
            <BoxW display="flex" justifyContent="center" flexWrap="wrap" p={1} marginBottom={2} width="100%">
              {githubConnected && (
                <BoxW width="20%">
                  <SocialButton variant={GITHUB} onClick={() => prepareUntieDialog('github')}>
                    {t('pages.myAccount.gitHub')}
                  </SocialButton>
                </BoxW>
              )}
              {googleConnected && (
                <BoxW width="20%">
                  <SocialButton variant={GOOGLE} onClick={() => prepareUntieDialog('google')}>
                    {t('pages.myAccount.google')}
                  </SocialButton>
                </BoxW>
              )}
            </BoxW>
          )}
          <ImageEditor {...{ userImage, setUserImage, userEditImage, setUserEditImage }} />
          <BoxW width="10%" p={1} minWidth="100px">
            <Controller
              name="id"
              render={({ field }) => <TextFieldW label={t('pages.myAccount.id')} {...field} disabled />}
              defaultValue={currentUser && currentUser.id}
              control={control}
            />
          </BoxW>
          <BoxW width="30%" p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.myAccount.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="tagName"
              render={({ field }) => <TextFieldW label={t('pages.myAccount.cardName')} {...field} error={errors?.tagName} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="25%" p={1}>
            <Controller
              name="email"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.email')}
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
          <BoxW width="20%" p={1}>
            <Controller
              name="github"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.github')}
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
          <BoxW width="20%" p={1}>
            <Controller
              name="linkedin"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.linkedin')}
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
          <BoxW width="20%" p={1}>
            <Controller
              name="lattes"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.lattes')}
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
          <BoxW width="20%" p={1}>
            <Controller
              name="orcid"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.orcid')}
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
          <BoxW width="20%" p={1}>
            <Controller
              name="website"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.myAccount.website')}
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
              render={({ field }) => <GenderSelector label={t('pages.myAccount.gender')} {...field} />}
              defaultValue={Gender.getValue('UNDEFINED')}
              control={control}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="birthDate"
              render={({ field }) => <DatePickerW label={t('pages.myAccount.birthDate')} disableFuture {...field} />}
              defaultValue={null}
              control={control}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
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
                  label={t('pages.myAccount.zipCode')}
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
                  label={t('pages.myAccount.state')}
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
                  label={t('pages.myAccount.city')}
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
                  label={t(`pages.myAccount.address${country === 'BR' ? 'Unique' : ''}`)}
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
                render={({ field }) => <TextFieldW label={t('pages.myAccount.address2')} {...field} />}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={handleOthers() ? '34%' : '25%'} p={1}>
            <Controller
              name="institution"
              render={({ field }) => (
                <InstitutionAutoComplete
                  label={t('pages.myAccount.company')}
                  {...field}
                  setOpenDialog={setOpenDialog}
                  setLink={setLink}
                  link={EDIT_INSTITUTION}
                />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width={handleOthers() ? '33%' : '25%'} p={1}>
            <Controller
              name="needsTypes"
              render={({ field }) => <SpecialNeedsAutoComplete label={t('pages.myAccount.specialNeedsText')} {...field} />}
              defaultValue={[]}
              control={control}
            />
          </BoxW>
          {!handleOthers() && (
            <BoxW width="25%" p={1}>
              <Controller
                name="otherNeeds"
                render={({ field }) => <TextFieldW label={t('pages.myAccount.otherNeeds')} {...field} />}
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
                  label={t('pages.myAccount.biography')}
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
                  label={t('pages.myAccount.mobilePhone')}
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
                  label={t('pages.myAccount.phone')}
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
                <ShowHidePassword label={t('pages.autoRegistration.password.password')} {...field} error={errors?.password} />
              )}
              control={control}
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
                />
              )}
              control={control}
            />
          </BoxW>
          <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
            <Controller
              name="emailCommunication"
              render={({ field }) => (
                <FormControlLabel
                  control={<CheckboxW checked={watch('emailCommunication', true)} primary {...field} />}
                  label={t('pages.myAccount.allowEmail')}
                  labelPlacement="end"
                />
              )}
              /* eslint-disable-next-line react/jsx-boolean-value */
              defaultValue={true}
              control={control}
            />
          </BoxW>
          <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
            <Controller
              name="socialCommunication"
              render={({ field }) => (
                <FormControlLabel
                  control={<CheckboxW checked={watch('socialCommunication', false)} primary {...field} />}
                  label={t('pages.myAccount.allowContact')}
                  labelPlacement="end"
                />
              )}
              /* eslint-disable-next-line react/jsx-boolean-value */
              defaultValue={false}
              control={control}
            />
          </BoxW>
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default MyAccount;
