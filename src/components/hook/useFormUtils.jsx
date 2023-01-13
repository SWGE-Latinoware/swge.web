import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useToast } from '../context/toast/ToastContext';

const useFormUtils = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();

  return {
    validateMask: (value, country) => {
      if (country !== 'BR') {
        return true;
      }
      return !value?.includes('_');
    },
    scoreWords: useMemo(
      () => Object.entries(i18n.getDataByLanguage(i18n.language).translation.enums.passwordStrength).map((e) => e[1]),
      [i18n]
    ),
    validateUnique: (service, urlFragment, value, property, ignore) => {
      if (value == null || value === '' || ignore) {
        return true;
      }
      return service.validateUnique(value, urlFragment, property).then((response) => {
        if (response.status === 200) {
          return !response.data;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
        return true;
      });
    },
    validateUniqueEdition: (service, urlFragment, value, property, edition, ignore) => {
      if (value == null || value === '' || ignore) {
        return true;
      }
      return service.validateUniqueEdition(value, urlFragment, property, edition).then((response) => {
        if (response.status === 200) {
          return !response.data;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
        return true;
      });
    },
    getHelperText: (errors) => {
      if (!errors) return undefined;

      return (
        (errors.type === 'required' && t('yup.requiredField')) ||
        (errors.type === 'unique' && t('yup.uniqueField')) ||
        (errors.type === 'email' && t('yup.emailFormat')) ||
        (errors.type === 'url' && t('yup.urlFormat')) ||
        (errors.type === 'typeError' && t('yup.requiredField')) ||
        (errors.type === 'registrationType' && t('yup.dateIntervalError')) ||
        (errors.type === 'min' && t('yup.positiveError')) ||
        (errors.type === 'integer' && t('yup.integerError')) ||
        (errors.type === 'match' && t('yup.maskError')) ||
        (errors.type === 'passwordStrength' && t('yup.passwordStrength')) ||
        (errors.type === 'matchPassword' && t('yup.passwordEqual')) ||
        (errors.type === 'minArray' && t('yup.requiredField')) ||
        (errors.type === 'minDate' && t('yup.pastFinalDateError')) ||
        (errors.type === 'passwordMin' && t('yup.passwordMin')) ||
        (errors.type === 'resourceTimeConflict' && t('yup.resourceTimeConflict')) ||
        (errors.type === 'minExpYear' && t('yup.wrongExpYear')) ||
        (errors.type === 'validMonth' && t('yup.validMonth')) ||
        (errors.type === 'wrongCardNumber' && t('yup.wrongCardNumber')) ||
        (errors.type === 'wrongSecurityCode' && t('yup.wrongSecurityCode'))
      );
    },
  };
};

export default useFormUtils;
