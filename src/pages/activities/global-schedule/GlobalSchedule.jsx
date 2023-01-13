import React from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../../components/toolbar/Toolbar';
import GlobalResourceSchedule from '../list-activities/GlobalResourceSchedule';
import BoxW from '../../../components/wrapper/BoxW';

const GlobalSchedule = () => {
  const { t } = useTranslation();

  const helperContent = [
    {
      title: t('pages.activityList.helper.scroll.title'),
      content: t('pages.activityList.helper.scroll.content'),
      target: '.scroll-container',
      placement: 'top',
    },
    {
      title: t('pages.activityList.helper.tracks.title'),
      content: t('pages.activityList.helper.tracks.content'),
      target: '#track-list',
    },
  ];

  return (
    <>
      <Toolbar
        title={[t('layouts.sidebar.activities'), t('layouts.sidebar.allActivities')]}
        hasArrowBack
        helperContent={helperContent}
        dislocation="100px"
        isSwipe
      />
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <GlobalResourceSchedule />
      </BoxW>
    </>
  );
};

export default GlobalSchedule;
