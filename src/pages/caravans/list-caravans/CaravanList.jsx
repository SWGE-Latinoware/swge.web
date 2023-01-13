import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import CaravanService from '../../../services/CaravanService';
import useLocation from '../../../components/hook/useLocation';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import CaravanType from '../../../enums/CaravanType';
import { FLUX_CARAVANS, FLUX_INSTITUTIONS, FLUX_USERS } from '../../../components/context/FluxContext';

const CaravanList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { getCountryName, formatState, formatCurrency } = useLocation();

  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.caravanList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'country',
        label: t('pages.caravanList.columns.country'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (country) => getCountryName(country),
          },
          customFilterListOptions: {
            render: (country) => getCountryName(country),
          },
          customBodyRenderLite: (dataIndex) => getCountryName(data[dataIndex].country),
        },
      },
      {
        name: 'state',
        label: t('pages.caravanList.columns.state'),
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
        label: t('pages.caravanList.columns.city'),
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
        name: 'institution.name',
        label: t('pages.caravanList.columns.institution'),
        options: {
          filter: true,
        },
      },
      {
        name: 'coordinator.name',
        label: t('pages.caravanList.columns.coordinator'),
        options: {
          filter: true,
        },
      },
      {
        name: 'type',
        label: t('pages.caravanList.columns.type'),
        enum: CaravanType,
        options: {
          filter: true,
          filterOptions: {
            renderValue: (type) => t(`enums.caravanTypes.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.caravanTypes.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.caravanTypes.${data[dataIndex].type}`),
        },
      },
      {
        name: 'price',
        label: t('pages.caravanList.columns.price'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => formatCurrency(data[dataIndex].price),
        },
      },
      {
        name: 'vacancies',
        label: t('pages.caravanList.columns.vacancies'),
        options: {
          filter: false,
        },
      },
      {
        name: 'remainingVacancies',
        label: t('pages.caravanList.columns.remainingVacancies'),
        options: {
          searchable: false,
          filter: false,
          sort: false,
        },
      },
      {
        name: 'payed',
        label: t('pages.caravanList.columns.payed'),
        options: {
          filter: true,
          searchable: false,
          filterOptions: {
            renderValue: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customFilterListOptions: {
            render: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.payed.${data[dataIndex].payed ? 'PAYED' : 'NOT_PAYED'}`),
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
    [data, formatCurrency, formatState, getCountryName, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.caravanList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/caravan')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.caravans')]} hasArrowBack />
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
            textLabelsCod="caravanList"
            defaultOnRowClickURL="/cli/caravan"
            defaultService={CaravanService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            editionBasedMandatoryField="edition.id"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_USERS, FLUX_INSTITUTIONS, FLUX_CARAVANS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default CaravanList;
