import React, { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { addBusinessDays, intervalToDuration } from 'date-fns';
import FormDialog, { EDIT_USER } from '../../components/form-generic/FormDialog';
import { StyledCard } from '../../components/context/ThemeChangeContext';
import ServerSideList from '../../components/server-side-list/ServerSideList';
import UserService from '../../services/UserService';
import { FLUX_USERS } from '../../components/context/FluxContext';
import useLocation from '../../components/hook/useLocation';

const UserList = (props) => {
  const { isInternalPage = false } = props;
  const { t } = useTranslation();
  const { formatLocaleDateString } = useLocation();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);
  const [internalID, setInternalID] = useState(undefined);

  const calculateInactivity = useCallback(
    (lastLogin) => {
      const interval = intervalToDuration({
        start: new Date(lastLogin),
        end: new Date(),
      });

      if (interval.years === 0 && interval.months === 1) {
        return t('inactivity.month');
      }
      if (interval.years > 0) return `${t(`inactivity.months`).replace('$0', interval.years * 12 + interval.months)}`;
      if (interval.months > 0) return `${t(`inactivity.months`).replace('$0', interval.months)}${interval.months > 1 ? 's' : ''}`;
      if (interval.weeks > 0) return `${t(`inactivity.weeks`).replace('$0', interval.weeks)}${interval.weeks > 1 ? 's' : ''}`;
      if (interval.days > 0) return `${t(`inactivity.days`).replace('$0', interval.days)}${interval.days > 1 ? 's' : ''}`;
      if (interval.hours > 0) return `${t(`inactivity.hours`).replace('$0', interval.hours)}${interval.hours > 1 ? 's' : ''}`;
      if (interval.minutes > 0) return `${t(`inactivity.minutes`).replace('$0', interval.minutes)}${interval.minutes > 1 ? 's' : ''}`;

      return '-';
    },
    [t]
  );

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.userList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'tagName',
        label: t('pages.userList.columns.tagName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'email',
        label: t('pages.userList.columns.email'),
        options: {
          filter: true,
        },
      },
      {
        name: 'cellPhone',
        label: t('pages.userList.columns.cellPhone'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) =>
            data[dataIndex].cellPhone == null || data[dataIndex].cellPhone === '' ? '-' : data[dataIndex].cellPhone,
        },
      },
      {
        name: 'exclusionDate',
        label: t('pages.userList.columns.exclusionDate'),
        options: {
          sort: false,
          searchable: false,
          filter: false,
          customBodyRenderLite: (dataIndex) => {
            if (data[dataIndex].exclusionRequests?.length > 0) {
              const exclusion = data[dataIndex].exclusionRequests.filter(
                (exclusionRequest) => exclusionRequest.status === 'APPROVED' || exclusionRequest.status === 'NOT_ANALYZED'
              )[0];
              if (exclusion) {
                return (
                  <Typography
                    sx={(theme) => ({
                      color: exclusion.status === 'APPROVED' ? theme.palette.error.main : theme.palette.warning.main,
                    })}
                  >
                    {formatLocaleDateString(
                      exclusion.status === 'APPROVED'
                        ? exclusion.deadlineExclusionDate
                        : addBusinessDays(new Date(exclusion.registryDate), 15)
                    )}
                  </Typography>
                );
              }
            }
            return '-';
          },
        },
      },
      {
        name: 'lastLogin',
        label: t('pages.userList.columns.inactivity'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => {
            if (data[dataIndex].lastLogin)
              return (
                <Typography sx={(theme) => ({ color: theme.palette.error.main })}>
                  {calculateInactivity(data[dataIndex].lastLogin)}
                </Typography>
              );
            return '-';
          },
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
            <IconButton
              tabIndex={-1}
              onClick={
                isInternalPage
                  ? (rowData, rowMeta) => {
                      setLink(EDIT_USER);
                      setOpenDialog(true);
                      setInternalID(data[rowMeta.dataIndex].id);
                    }
                  : undefined
              }
            >
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ],
    [calculateInactivity, data, formatLocaleDateString, isInternalPage, t]
  );

  const options = {
    selectableRows: 'none',
    onRowClick: isInternalPage
      ? (rowData, rowMeta) => {
          setLink(EDIT_USER);
          setOpenDialog(true);
          setInternalID(data[rowMeta.dataIndex].id);
        }
      : undefined,
  };

  return (
    <>
      <FormDialog openDialog={openDialog} setOpenDialog={setOpenDialog} link={link} linkProps={{ isInternalPage: true, id: internalID }} />
      {!isInternalPage && <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.users')]} hasArrowBack />}
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
            textLabelsCod="userList"
            defaultOnRowClickURL="/cli/dpo/user"
            defaultService={UserService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_USERS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default UserList;
