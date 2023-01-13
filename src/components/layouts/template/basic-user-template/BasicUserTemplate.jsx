import React from 'react';
import { useTranslation } from 'react-i18next';
import Template from '../Template';
import { useEditionChange } from '../../../context/EditionChangeContext';

const BasicUserTemplate = (props) => {
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();

  return (
    <Template
      applicationName={(currentEdition && currentEdition.name) || t('general.applicationName')}
      template="basicUser"
      {...props}
    />
  );
};
export default BasicUserTemplate;
