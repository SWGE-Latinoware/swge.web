import React, { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import _ from 'lodash';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import UserService from '../../../services/UserService';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import SwitchW from '../../../components/wrapper/SwitchW';
import { useToast } from '../../../components/context/toast/ToastContext';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { FLUX_USERS } from '../../../components/context/FluxContext';
import FormDialog, { EDIT_USER } from '../../../components/form-generic/FormDialog';

const UserList = (props) => {
  const { isInternalPage = false } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [link, setLink] = useState(null);
  const [internalID, setInternalID] = useState(undefined);

  const changeEnabled = useCallback(
    (dataIndex) => {
      const ed = _.clone(data[dataIndex]);
      UserService.changeEnable(ed.id).then((response) => {
        if (response.status === 200) {
          const newData = _.clone(data);
          newData[dataIndex] = response.data;
          setData(newData);
          return;
        }
        addToast({ body: t('toastes.userEnabledError'), type: 'error' });
      });
    },
    [addToast, data, t]
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
        name: 'enabled',
        label: t('pages.userList.columns.enable'),
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
    [changeEnabled, data, isInternalPage, t]
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
    customToolbar: () => (
      <Tooltip title={t('pages.userList.tooltip.add')}>
        <IconButton
          onClick={() => {
            if (isInternalPage) {
              setInternalID(null);
              setLink(EDIT_USER);
              setOpenDialog(true);
              return;
            }
            history.push('/cli/user');
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    ),
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
            defaultOnRowClickURL="/cli/user"
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
