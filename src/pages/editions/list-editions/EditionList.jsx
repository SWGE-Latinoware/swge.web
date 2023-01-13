import React, { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import _ from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import SwitchW from '../../../components/wrapper/SwitchW';
import EditionService from '../../../services/EditionService';
import { useToast } from '../../../components/context/toast/ToastContext';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import { FLUX_EDITIONS } from '../../../components/context/FluxContext';

const EditionList = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { setUpdateEdition } = useEditionChange();

  const [data, setData] = useState([]);

  const changeEnabled = useCallback(
    (dataIndex, enabled) => {
      const ed = _.clone(data[dataIndex]);
      ed.enabled = enabled;
      EditionService.update(ed).then((response) => {
        if (response.status === 200) {
          setUpdateEdition(true);
          const newData = _.clone(data);
          newData[dataIndex] = response.data;
          setData(newData);
          return;
        }
        addToast({ body: t('toastes.editionEnabledError'), type: 'error' });
      });
    },
    [addToast, data, t, setUpdateEdition]
  );

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.editionList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'year',
        label: t('pages.editionList.columns.year'),
        options: {
          filter: true,
        },
      },
      {
        name: 'enabled',
        label: t('pages.editionList.columns.enabled'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (enabled) => t(`enums.enabled.${enabled}`),
          },
          customFilterListOptions: {
            render: (enabled) => t(`enums.enabled.${enabled}`),
          },
          sort: true,
          searchable: true,
          customBodyRenderLite: (dataIndex) => (
            <SwitchW
              checked={data[dataIndex].enabled}
              onChange={(e) => changeEnabled(dataIndex, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              name="preview"
              primary
            />
          ),
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
    [changeEnabled, data, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.editionList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edition')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.editions')]} hasArrowBack />
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
            textLabelsCod="editionList"
            defaultOnRowClickURL="/cli/edition"
            defaultService={EditionService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            onRowsDeleteOk={() => setUpdateEdition(true)}
            defaultSortOrder={{ name: 'year', direction: 'desc' }}
            fluxListeners={useMemo(() => [FLUX_EDITIONS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default EditionList;
