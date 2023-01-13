import React, { useMemo, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { PersonRemove } from '@mui/icons-material';
import _ from 'lodash';
import { StyledCard } from '../../components/context/ThemeChangeContext';
import ServerSideList from '../../components/server-side-list/ServerSideList';
import { FLUX_EXCLUSIONS, FLUX_TUTORED_USERS, FLUX_USERS } from '../../components/context/FluxContext';
import ExclusionService from '../../services/ExclusionService';
import useLocation from '../../components/hook/useLocation';
import DPOManageExclusionActionCustomDialog from '../../components/dpo-manage-exclusion-dialog/DPOManageExclusionActionCustomDialog';
import ExclusionStatus from '../../enums/ExclusionStatus';
import Toolbar from '../../components/toolbar/Toolbar';
import DPOUserExclusionActionCustomDialog from '../../components/dpo-user-exclusion-action-custom-dialog/DPOUserExclusionActionCustomDialog';

const ExclusionRequests = () => {
  const { t } = useTranslation();
  const { formatLocaleDateString } = useLocation();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [removeDialog, setRemoveDialog] = useState(false);
  const [selectedExclusion, setSelectedExclusion] = useState(null);

  const columns = useMemo(
    () => [
      {
        name: 'status',
        label: t('pages.exclusionList.columns.exclusionStatus'),
        enum: ExclusionStatus,
        options: {
          sort: true,
          filter: true,
          searchable: true,
          filterOptions: {
            renderValue: (type) => t(`enums.exclusionStatus.${type === null || type === '' ? 'null' : type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.exclusionStatus.${type === null || type === '' ? 'null' : type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.exclusionStatus.${data[dataIndex].status}`),
        },
      },
      {
        name: 'requestDate',
        label: t('pages.exclusionList.columns.registryDate'),
        options: {
          sort: false,
          searchable: false,
          filter: false,
          customBodyRenderLite: (dataIndex) => formatLocaleDateString(data[dataIndex].deleteRequest.requestDate),
        },
      },
      {
        name: 'name',
        label: t('pages.exclusionList.columns.name'),
        options: {
          filter: false,
          searchable: false,
          sort: false,
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].user == null ? data[dataIndex].tutoredUser.name : data[dataIndex].user.name,
        },
      },
      {
        name: 'email',
        label: t('pages.exclusionList.columns.email'),
        options: {
          filter: false,
          searchable: false,
          sort: false,
          customBodyRenderLite: (dataIndex) => (data[dataIndex].user == null ? '-' : data[dataIndex].user.email),
        },
      },
      {
        name: 'note',
        label: t('pages.exclusionList.columns.note'),
        options: {
          sort: false,
          searchable: false,
          filter: false,
          customBodyRenderLite: (dataIndex) => (data[dataIndex].deleteRequest.note ? data[dataIndex].deleteRequest.note : '-'),
        },
      },
      {
        name: 'applicantContact',
        label: t('pages.exclusionList.columns.applicantContact'),
        options: {
          sort: false,
          searchable: false,
          filter: false,
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].deleteRequest.applicantContact ? data[dataIndex].deleteRequest.applicantContact : '-',
        },
      },
      {
        name: 'requestType',
        label: t('pages.exclusionList.columns.requestType'),
        options: {
          sort: false,
          searchable: false,
          filter: false,
          filterOptions: {
            renderValue: (type) => t(`enums.requestType.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.requestType.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.requestType.${data[dataIndex].deleteRequest.requestType}`),
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
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              tabIndex={-1}
              onClick={() => {
                setOpenDialog(true);
                setRemoveDialog(false);
                setSelectedExclusion(data[dataIndex]);
              }}
            >
              <EditIcon />
            </IconButton>
          ),
        },
      },
      {
        name: 'exclusion',
        label: ' ',
        options: {
          filter: false,
          sort: false,
          searchable: false,
          customBodyRenderLite: (dataIndex) => (
            <IconButton
              tabIndex={-1}
              onClick={() => {
                setOpenDialog(false);
                setRemoveDialog(true);
                setSelectedExclusion(data[dataIndex]);
              }}
              disabled={data[dataIndex] && data[dataIndex].status !== 'APPROVED'}
            >
              <PersonRemove />
            </IconButton>
          ),
        },
      },
    ],
    [data, formatLocaleDateString, t]
  );

  const options = {
    selectableRows: 'none',
    onCellClick: (colData, colMeta) => {
      setSelectedExclusion(data[colMeta.dataIndex]);
      if (colMeta.colIndex === _.findIndex(columns, (o) => o.name === 'exclusion')) {
        setOpenDialog(false);
        setRemoveDialog(true);
      } else {
        setOpenDialog(true);
        setRemoveDialog(false);
      }
    },
    onRowClick: () => {},
  };

  return (
    <>
      {openDialog && !removeDialog && (
        <DPOManageExclusionActionCustomDialog openDialog={openDialog} setOpenDialog={setOpenDialog} requestData={selectedExclusion} />
      )}
      {removeDialog && !openDialog && (
        <DPOUserExclusionActionCustomDialog openDialog={removeDialog} setOpenDialog={setRemoveDialog} requestData={selectedExclusion} />
      )}
      <Toolbar title={[t('layouts.sidebar.dpo'), t('layouts.sidebar.exclusions')]} hasArrowBack />
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
            textLabelsCod="exclusionList"
            defaultOnRowClickURL="/cli/exclusion"
            defaultService={ExclusionService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultSortOrder={{ name: 'registryDate', direction: 'desc' }}
            fluxListeners={useMemo(() => [FLUX_EXCLUSIONS, FLUX_USERS, FLUX_TUTORED_USERS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default ExclusionRequests;
