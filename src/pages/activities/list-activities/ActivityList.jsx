import React, { useMemo, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import useLocation from '../../../components/hook/useLocation';
import TabsPanel from '../../../components/tabs-panel/TabsPanel';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import ActivityService from '../../../services/ActivityService';
import ActivityType from '../../../enums/ActivityType';
import EditionType from '../../../enums/EditionType';
import { FLUX_ACTIVITIES, FLUX_TRACKS } from '../../../components/context/FluxContext';
import GlobalResourceSchedule from './GlobalResourceSchedule';

export const isLecture = (type) => {
  const realType = ActivityType.getValue(type);
  return realType === ActivityType.getValue('LECTURE') || realType === ActivityType.getValue('KEYNOTE');
};

const ActivityList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { formatCurrency } = useLocation();

  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

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

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.activityList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'track.name',
        label: t('pages.activityList.columns.track'),
        options: {
          filter: true,
        },
      },
      {
        name: 'price',
        label: t('pages.activityList.columns.price'),
        options: {
          filter: false,
          customBodyRender: (price) => formatCurrency(price),
        },
      },
      {
        name: 'vacancies',
        label: t('pages.activityList.columns.vacancies'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => (isLecture(data[dataIndex].type) ? '-' : data[dataIndex].vacancies),
        },
      },
      {
        name: 'remainingVacancies',
        label: t('pages.activityList.columns.remainingVacancies'),
        options: {
          searchable: false,
          filter: false,
          sort: false,
          customBodyRenderLite: (dataIndex) => (isLecture(data[dataIndex].type) ? '-' : data[dataIndex].remainingVacancies),
        },
      },
      {
        name: 'type',
        label: t('pages.activityList.columns.type'),
        enum: ActivityType,
        options: {
          searchable: false,
          filter: true,
          filterOptions: {
            renderValue: (type) => t(`enums.activityTypes.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.activityTypes.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.activityTypes.${data[dataIndex].type}`),
        },
      },
      {
        name: 'presentationType',
        label: t('pages.activityList.columns.presentationType'),
        enum: EditionType,
        options: {
          searchable: false,
          filter: true,
          filterOptions: {
            renderValue: (type) => t(`enums.editionTypes.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.editionTypes.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.editionTypes.${data[dataIndex].presentationType}`),
        },
      },
      {
        name: 'actions',
        label: ' ',
        options: {
          filter: false,
          sort: false,
          searchable: false,
          viewColumns: false,
          customBodyRenderLite: () => (
            <IconButton tabIndex={-1}>
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ],
    [data, formatCurrency, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.activityList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/activity')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar
        title={[t('layouts.sidebar.records'), t('layouts.sidebar.activities')]}
        hasArrowBack
        helperContent={activeTab === 1 && helperContent}
        dislocation="300px"
        isSwipe
      />
      <TabsPanel
        primary
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { label: t('pages.activityList.tabs.activities'), enabled: true },
          { label: t('pages.activityList.tabs.schedule'), enabled: true },
        ]}
        panels={[
          <ServerSideList
            {...{
              columns,
              options,
              data,
              setData,
            }}
            enableDefaultUseEffect
            textLabelsCod="activityList"
            defaultOnRowClickURL="/cli/activity"
            defaultService={ActivityService}
            onRowsDeleteErrorToast="toastes.deletesError"
            onRowsDeleteToast="toastes.deletes"
            editionBasedMandatoryField="track.edition.id"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_TRACKS, FLUX_ACTIVITIES], [])}
          />,
          <GlobalResourceSchedule />,
        ]}
      />
    </>
  );
};

export default ActivityList;
