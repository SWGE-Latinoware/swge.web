import React from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../../components/toolbar/Toolbar';
import TabsPanel from '../../../components/tabs-panel/TabsPanel';
import RegistrationListPanel from '../../registrations/list-registrations/RegistrationListPanel';
import TutoredRegistrationListPanel from '../../registrations/list-registrations/TutoredRegistrationListPanel';

const RegistrationList = () => {
  const { t } = useTranslation();

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.enrollments'), t('layouts.sidebar.registrations')]} hasArrowBack />
      <TabsPanel
        primary
        tabs={[
          { label: t('pages.registrationList.tabs.registrations'), enabled: true },
          { label: t('pages.registrationList.tabs.tutoredRegistrations'), enabled: true },
        ]}
        panels={[<RegistrationListPanel />, <TutoredRegistrationListPanel />]}
      />
    </>
  );
};

export default RegistrationList;
