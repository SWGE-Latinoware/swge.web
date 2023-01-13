import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import InstitutionService from '../../../services/InstitutionService';
import useLocation from '../../../components/hook/useLocation';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { FLUX_INSTITUTIONS } from '../../../components/context/FluxContext';

const InstitutionList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { getCountryName, formatState } = useLocation();

  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.institutionList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'country',
        label: t('pages.institutionList.columns.country'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) =>
              getCountryName(value) == null || getCountryName(value) === '' ? t(`enums.empty.EMPTY`) : getCountryName(value),
          },
          customFilterListOptions: {
            render: (value) =>
              getCountryName(value) == null || getCountryName(value) === '' ? t(`enums.empty.EMPTY`) : getCountryName(value),
          },
          customBodyRenderLite: (dataIndex) =>
            getCountryName(data[dataIndex].country) == null || getCountryName(data[dataIndex].country) === ''
              ? '-'
              : getCountryName(data[dataIndex].country),
        },
      },
      {
        name: 'state',
        label: t('pages.institutionList.columns.state'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customFilterListOptions: {
            render: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customBodyRenderLite: (dataIndex) =>
            formatState(data[dataIndex].state) == null || formatState(data[dataIndex].state) === ''
              ? '-'
              : formatState(data[dataIndex].state),
        },
      },
      {
        name: 'city',
        label: t('pages.institutionList.columns.city'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) => (data[dataIndex].city == null || data[dataIndex].city === '' ? '-' : data[dataIndex].city),
        },
      },
      {
        name: 'phone',
        label: t('pages.institutionList.columns.phone'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].phone == null || data[dataIndex].phone === '' ? '-' : data[dataIndex].phone,
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
    [data, formatState, getCountryName, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.institutionList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/institution')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.institutions')]} hasArrowBack />
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
            textLabelsCod="institutionList"
            defaultOnRowClickURL="/cli/institution"
            defaultService={InstitutionService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_INSTITUTIONS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default InstitutionList;
