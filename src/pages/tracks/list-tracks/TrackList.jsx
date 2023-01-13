import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import TrackService from '../../../services/TrackService';
import useLocation from '../../../components/hook/useLocation';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { FLUX_TRACKS } from '../../../components/context/FluxContext';

const TrackList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { formatLocaleDateString } = useLocation();

  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.trackList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'initialDate',
        label: t('pages.trackList.columns.initialDate'),
        options: {
          filter: true,
          customBodyRender: (date) => formatLocaleDateString(date),
        },
      },
      {
        name: 'finalDate',
        label: t('pages.trackList.columns.finalDate'),
        options: {
          filter: true,
          customBodyRender: (date) => formatLocaleDateString(date),
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
    [formatLocaleDateString, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.trackList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/track')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.tracks')]} hasArrowBack />
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
            textLabelsCod="trackList"
            defaultOnRowClickURL="/cli/track"
            defaultService={TrackService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            editionBasedMandatoryField="edition.id"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_TRACKS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default TrackList;
