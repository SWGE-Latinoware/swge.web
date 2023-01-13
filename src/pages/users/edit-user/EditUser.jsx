import React, { useCallback, useEffect, useState } from 'react';
import { FormControlLabel } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WebIcon from '@mui/icons-material/Web';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { useToast } from '../../../components/context/toast/ToastContext';
import ButtonW from '../../../components/wrapper/ButtonW';
import FormUtils from '../../../utils/FormUtils';
import UserService from '../../../services/UserService';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import useInstitution from '../../../components/hook/useInstitution';
import useLocation from '../../../components/hook/useLocation';
import useFormUtils from '../../../components/hook/useFormUtils';
import ConditionalMaskField from '../../../components/form-components/ConditionalMaskField';
import ConditionStateAutoComplete from '../../../components/form-components/ConditionStateAutoComplete';
import ConditionCityAutoComplete from '../../../components/form-components/ConditionCityAutoComplete';
import CountryAutoComplete from '../../../components/form-components/CountryAutoComplete';
import InstitutionAutoComplete from '../../../components/form-components/InstitutionAutoComplete';
import IconSvg from '../../../components/icon-svg-styles/IconSvg';
import { ReactComponent as OrcidIcon } from '../../../assets/image/orcid-brands.svg';
import MUIRichTextEditorW from '../../../components/wrapper/MUIRichTextEditorW';
import DatePickerW from '../../../components/wrapper/DatePickerW';
import SpecialNeedsAutoComplete from '../../../components/form-components/SpecialNeedsAutoComplete';
import SpecialNeedsType from '../../../enums/SpecialNeedsType';
import UserRoleType from '../../../enums/UserRoleType';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import BoxW from '../../../components/wrapper/BoxW';
import UserUtils from '../../../utils/UserUtils';
import RegistrationService from '../../../services/RegistrationService';
import FileService from '../../../services/FileService';
import ImageEditor from '../../../components/image-editor/ImageEditor';
import ChipAutoComplete from '../../../components/form-components/ChipAutoComplete';
import FormGenerics from '../../../components/form-generic/FormGenerics';
import FormDialog, { EDIT_INSTITUTION } from '../../../components/form-generic/FormDialog';
import GenderSelector from '../../../components/form-components/GenderSelector';
import Gender from '../../../enums/Gender';

const EditUser = (props) => {
  const { isInternalPage = false, id: internalID, goBack } = props;
  const { addToast } = useToast();
  const { t } = useTranslation();
  const history = useHistory();
  const { id: idURL } = useParams();
  const { monitorCEP } = useLocation();
  const { getInstitutionById } = useInstitution();
  const { validateMask, validateUnique } = useFormUtils();
  const { currentEdition } = useEditionChange();

  const id = isInternalPage ? internalID : idURL;

  const [country, setCountry] = useState('BR');
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userPermissionCache, setUserPermissionCache] = useState([]);
  const [bibliographyState, setBibliographyState] = useState(undefined);
  const [originalUniqueValues, setOriginalUniqueValues] = useState(undefined);
  const [registered, setRegistered] = useState(false);
  const [updateRegistration, setUpdateRegistration] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);

  const [userImage, setUserImage] = useState(null);
  const [userEditImage, setUserEditImage] = useState(null);

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
  });

  const { control, handleSubmit, setValue, formState, getValues, watch } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const userProfile = watch('userProfile', null);

  const otherCheck = watch('needsTypes', []);

  const emailConfirmed = watch('confirmed', false);

  const handleOthers = () => otherCheck.find((o) => SpecialNeedsType.getValue('OTHERS') === o) === undefined;

  const handleSave = useCallback(
    (formUser) => {
      const form = FormUtils.removeEmptyFields(formUser);
      form.institution = getInstitutionById(form.institution);
      form.bibliography = bibliographyState;
      form.userPermissions = [
        ...form.userPermissions.map((value) => ({
          userRole: value,
          edition: currentEdition,
          user: id ? { id } : undefined,
        })),
        ...userPermissionCache,
      ];

      const userImg = userImage ? getValues('userProfile') : null;

      const operation = (resp) => {
        if (resp.status === 200) {
          form.userProfile = resp.data;

          if (id) {
            if (form.password === '') {
              delete form.password;
            }
            UserService.updateByAdmin(form).then((response) => {
              if (response.status === 200) {
                addToast({ body: t('toastes.update'), type: 'success' });
                if (goBack) {
                  if (typeof goBack === 'string') history.push(goBack);
                  else goBack();
                } else history.push('/cli/users');
              } else if (response.status >= 400 && response.status <= 500) {
                addToast({ body: t('toastes.saveError'), type: 'error' });
              }
            });
            return;
          }
          UserService.create(form).then((response) => {
            if (response.status === 200) {
              addToast({ body: t('toastes.save'), type: 'success' });
              if (goBack) {
                if (typeof goBack === 'string') history.push(goBack);
                else goBack();
              } else history.push('/cli/users');
            } else if (response.status >= 400 && response.status <= 500) {
              addToast({ body: t('toastes.saveError'), type: 'error' });
            }
          });
        }
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
    [
      addToast,
      bibliographyState,
      currentEdition,
      getInstitutionById,
      getValues,
      goBack,
      history,
      id,
      t,
      userEditImage,
      userImage,
      userPermissionCache,
    ]
  );

  const handleResetPassword = () => {
    UserService.resetPassword(userEmail)
      .then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.resetPassword'), type: 'success' });
          return;
        }
        addToast({ body: t('toastes.resetPasswordError'), type: 'error' });
      })
      .finally(() => setOpenResetDialog(false));
  };

  const handleEmailConfirmation = () => {
    UserService.emailConfirmation(id).then((response) => {
      if (response.status === 200) {
        addToast({ body: t('toastes.emailSent'), type: 'success' });
        return;
      }
      addToast({ body: t('toastes.emailSentError'), type: 'error' });
    });
  };

  const handleRegistration = () => {
    if (currentEdition && id) {
      const form = {
        edition: currentEdition,
        user: { id },
        individualRegistrations: [],
      };
      RegistrationService.create(form).then((response) => {
        if (response.status === 200) {
          addToast({ body: t('toastes.registrationSave'), type: 'success' });
        } else if (response.status >= 400 && response.status <= 500) {
          addToast({ body: t('toastes.registrationSaveError'), type: 'error' });
        }
        setUpdateRegistration(true);
      });
    }
  };

  useEffect(() => {
    if (!currentEdition || !id || !updateRegistration) return;
    setUpdateRegistration(false);
    RegistrationService.findOneByEditionAndUser(currentEdition.id, id).then((response) => {
      if (response.status === 200) {
        setRegistered(true);
        return;
      }
      if (response.status === 404) {
        setRegistered(false);
        return;
      }
      setRegistered(false);
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, currentEdition, t, id, updateRegistration]);

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
          case 'gender':
            setValue(key, Gender.getValue(value));
            return;
          case 'institution':
            setValue(key, (value && value.id) || '');
            return;
          case 'email':
            if (UserUtils.isFakeTempEmail(value)) {
              uniqueValues[key] = '';
              setValue(key, undefined);
              setUserEmail(null);
              return;
            }
            uniqueValues[key] = value;
            setValue(key, value);
            setUserEmail(value);
            return;
          case 'needsTypes':
            setValue(key, (value && value.map((item) => SpecialNeedsType.getValue(item))) || []);
            return;
          case 'userPermissions':
            // eslint-disable-next-line no-case-declarations
            const permissionTemp = value.filter((item) => currentEdition && item?.edition?.id === currentEdition.id);
            setUserPermissionCache(value.filter((item) => (currentEdition ? item?.edition?.id !== currentEdition.id : true)));
            setValue(
              key,
              (permissionTemp.length > 0 && permissionTemp.map((perm) => UserRoleType.getValue(perm.userRole))) || [
                UserRoleType.getValue('ATTENDEE'),
              ]
            );
            return;
          case 'country':
            setCountry(value);
            setValue(key, value);
            return;
          default:
            setValue(key, value);
        }
      });
      setOriginalUniqueValues(uniqueValues);
    },
    [currentEdition, setValue]
  );

  useEffect(() => {
    if (userProfile) {
      FileService.findOne(userProfile.id).then((response) => {
        if (response.status === 200) {
          setUserImage(
            URL.createObjectURL(new Blob([response.data], { type: `image${userProfile.format === 'svg' ? '/svg+xml' : ''};charset=utf-8` }))
          );
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, t, userProfile]);

  return (
    <>
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} link={link} linkProps={{ isInternalPage: true }} />
      <FormGenerics
        title={[
          t('layouts.sidebar.records'),
          { title: t('layouts.sidebar.users'), url: '/cli/users' },
          { title: t(`pages.editUser.toolbar.${id ? 'editUser' : 'newUser'}`) },
        ]}
        id={id}
        goBack={goBack || '/cli/users'}
        defaultService={UserService}
        handleSubmit={handleSubmit}
        handleExternSave={handleSave}
        prepareFind={prepareFind}
        disableToolbar={isInternalPage}
      >
        <CustomDialog
          open={openResetDialog}
          onClose={() => setOpenResetDialog(false)}
          buttonErrorOnClick={() => handleResetPassword()}
          title={t('pages.editUser.resetDialogTitle')}
          content={t('pages.editUser.resetDialogContent')}
          buttonText={t('pages.editUser.cancelResetDialog')}
          buttonErrorText={t('pages.editUser.reset')}
        />
        <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
          <ImageEditor {...{ userImage, setUserImage, userEditImage, setUserEditImage }} />
          {id && (
            <BoxW width="10%" p={1} minWidth="100px">
              <Controller
                name="id"
                render={({ field }) => <TextFieldW label={t('pages.editUser.id')} {...field} disabled />}
                defaultValue={id}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={id ? '35%' : '45%'} p={1}>
            <Controller
              name="name"
              render={({ field }) => <TextFieldW label={t('pages.editUser.name')} {...field} error={errors?.name} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="tagName"
              render={({ field }) => <TextFieldW label={t('pages.editUser.cardName')} {...field} error={errors?.tagName} required />}
              control={control}
              rules={{ required: true }}
            />
          </BoxW>
          <BoxW width="20%" p={1}>
            <Controller
              name="email"
              render={({ field }) => (
                <TextFieldW
                  label={t('pages.editUser.email')}
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
                  label={t('pages.editUser.github')}
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
                  label={t('pages.editUser.linkedin')}
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
                  label={t('pages.editUser.lattes')}
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
                  label={t('pages.editUser.orcid')}
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
                  label={t('pages.editUser.website')}
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
              render={({ field }) => <GenderSelector label={t('pages.editUser.gender')} {...field} />}
              defaultValue={Gender.getValue('UNDEFINED')}
              control={control}
            />
          </BoxW>
          <BoxW width="15%" p={1} minWidth="200px">
            <Controller
              name="birthDate"
              render={({ field }) => <DatePickerW label={t('pages.editUser.birthDate')} disableFuture {...field} />}
              defaultValue={null}
              control={control}
            />
          </BoxW>
          <BoxW width="50%" p={1}>
            <Controller
              name="country"
              render={({ field }) => (
                <CountryAutoComplete
                  label={t('pages.editUser.country')}
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
                  label={t('pages.editUser.zipCode')}
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
                  label={t('pages.editUser.state')}
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
                  label={t('pages.editUser.city')}
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
                  label={t(`pages.editUser.address${country === 'BR' ? 'Unique' : ''}`)}
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
                render={({ field }) => <TextFieldW label={t('pages.editUser.address2')} {...field} />}
                control={control}
              />
            </BoxW>
          )}
          <BoxW width={handleOthers() ? '34%' : '25%'} p={1}>
            <Controller
              name="institution"
              render={({ field }) => (
                <InstitutionAutoComplete
                  label={t('pages.editUser.company')}
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
              render={({ field }) => <SpecialNeedsAutoComplete label={t('pages.editUser.specialNeedsText')} {...field} />}
              defaultValue={[]}
              control={control}
            />
          </BoxW>
          {!handleOthers() && (
            <BoxW width="25%" p={1}>
              <Controller
                name="otherNeeds"
                render={({ field }) => <TextFieldW label={t('pages.editUser.otherNeeds')} {...field} />}
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
                  label={t('pages.editUser.biography')}
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
                  label={t('pages.editUser.mobilePhone')}
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
                  label={t('pages.editUser.phone')}
                  {...field}
                />
              )}
              control={control}
            />
          </BoxW>
          {id && (
            <>
              <BoxW p={1} minWidth="200px">
                <ButtonW disabled={registered} onClick={handleRegistration} primary>
                  {t('pages.editUser.addRegistration')}
                </ButtonW>
              </BoxW>
              <BoxW p={1} width="15%" minWidth="200px">
                <ButtonW fullWidth secondary onClick={() => setOpenResetDialog(true)}>
                  {t('pages.editUser.resetPassword')}
                </ButtonW>
              </BoxW>
            </>
          )}
          {!emailConfirmed && (
            <BoxW p={1} width="12%">
              <ButtonW onClick={handleEmailConfirmation} primary>
                {t('pages.editUser.resendEmail')}
              </ButtonW>
            </BoxW>
          )}
          <BoxW display="flex" flexDirection="column" p={0} width="100%" justifyContent="flex-start">
            <BoxW width="25%" p={1} minWidth="200px">
              <Controller
                name="userPermissions"
                render={({ field }) => (
                  <ChipAutoComplete
                    options={UserRoleType.enums.map((item) => item.value)}
                    getOptionLabel={(o) => t(`enums.userRoleType.${UserRoleType.getKey(o)}`)}
                    label={t('pages.editUser.userPermissions')}
                    {...field}
                    inputProps={{
                      error: errors?.userPermissions,
                      required: true,
                    }}
                  />
                )}
                defaultValue={[]}
                control={control}
              />
            </BoxW>
            <BoxW display="flex" flexDirection="row" p={1} width="15%" justifyContent="flex-start" minWidth="250px">
              <Controller
                name="admin"
                render={({ field }) => (
                  <FormControlLabel
                    control={<CheckboxW checked={field.value} primary {...field} />}
                    label={t('pages.editUser.admin')}
                    labelPlacement="end"
                  />
                )}
                defaultValue={false}
                control={control}
              />
            </BoxW>
            <BoxW display="flex" flexDirection="row" p={1} width="15%" justifyContent="flex-start" minWidth="250px">
              <Controller
                name="enabled"
                render={({ field }) => (
                  <FormControlLabel
                    control={<CheckboxW checked={field.value} primary {...field} />}
                    label={t('pages.editUser.enable')}
                    labelPlacement="end"
                  />
                )}
                defaultValue
                control={control}
              />
            </BoxW>
          </BoxW>
          <BoxW display="flex" flexDirection="row" p={1} width="15%" justifyContent="flex-start" minWidth="250px">
            <Controller
              name="confirmed"
              render={({ field }) => (
                <FormControlLabel
                  control={<CheckboxW checked={field.value} primary {...field} />}
                  label={t('pages.editUser.confirmedEmail')}
                  labelPlacement="end"
                />
              )}
              defaultValue={false}
              control={control}
            />
          </BoxW>
          <BoxW display="flex" flexDirection="row" p={1} width="100%" justifyContent="flex-start">
            <Controller
              name="emailCommunication"
              render={({ field }) => (
                <FormControlLabel
                  control={<CheckboxW checked={watch('emailCommunication', true)} primary {...field} />}
                  label={t('pages.editUser.allowEmail')}
                  labelPlacement="end"
                />
              )}
              defaultValue={false}
              control={control}
            />
          </BoxW>
        </BoxW>
      </FormGenerics>
    </>
  );
};

export default EditUser;
