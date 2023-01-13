import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../../../components/toolbar/Toolbar';
import { StyledCard } from '../../../../components/context/ThemeChangeContext';
import ServerSideList from '../../../../components/server-side-list/ServerSideList';
import { FLUX_FEEDBACKS } from '../../../../components/context/FluxContext';
import FeedbackService from '../../../../services/FeedbackService';
import { useUserChange } from '../../../../components/context/UserChangeContext';
import useLocation from '../../../../components/hook/useLocation';
import FeedbackStatus from '../../../../enums/FeedbackStatus';

const MyFeedbacks = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { currentUser } = useUserChange();
  const { formatLocaleString } = useLocation();

  const [data, setData] = useState([]);

  const mandatoryFields = {
    'user.id': [currentUser?.id],
  };

  const columns = useMemo(
    () => [
      {
        name: 'title',
        label: t('pages.myFeedbacks.title'),
        options: {
          filter: true,
        },
      },
      {
        name: 'status',
        label: t('pages.myFeedbacks.status'),
        enum: FeedbackStatus,
        options: {
          filter: true,
          filterOptions: {
            renderValue: (status) => t(`enums.feedbackStatus.${status}`),
          },
          customFilterListOptions: {
            render: (status) => t(`enums.feedbackStatus.${status}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.feedbackStatus.${data[dataIndex].status}`),
        },
      },
      {
        name: 'creationDateTime',
        label: t('pages.myFeedbacks.date'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
    ],
    [data, formatLocaleString, t]
  );

  const options = {
    selectableRows: 'none',
    customToolbar: () => (
      <Tooltip title={t('pages.myFeedbacks.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edit-feedback')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.feedback'), t('layouts.sidebar.myFeedbacks')]} hasArrowBack />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <ServerSideList
            {...{
              columns,
              options,
              data,
              setData,
            }}
            enableDefaultUseEffect
            textLabelsCod="feedbackList"
            defaultService={FeedbackService}
            mandatoryFilterList={mandatoryFields}
            defaultSortOrder={{ name: 'creationDateTime', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_FEEDBACKS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default MyFeedbacks;
