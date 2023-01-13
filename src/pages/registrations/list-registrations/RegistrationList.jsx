import React from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../../components/toolbar/Toolbar';
import TabsPanel from '../../../components/tabs-panel/TabsPanel';
import ConfigRegistrationForm from './ConfigRegistrationForm';
import RegistrationListPanel from './RegistrationListPanel';
import TutoredRegistrationListPanel from './TutoredRegistrationListPanel';

const RegistrationList = () => {
  const { t } = useTranslation();

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.enrollments'),
          t('layouts.sidebar.registrations'),
        ]}
        hasArrowBack
      />
      <TabsPanel
        primary
        tabs={[
          { label: t('pages.registrationList.tabs.registrations'), enabled: true },
          { label: t('pages.registrationList.tabs.tutoredRegistrations'), enabled: true },
          { label: t('pages.registrationList.tabs.config'), enabled: true },
        ]}
        panels={[
          (
            <RegistrationListPanel />
          ),
          (
            <TutoredRegistrationListPanel />
          ),
          (
            <ConfigRegistrationForm />
          ),
        ]}
      />
    </>
  );
};

export default RegistrationList;
