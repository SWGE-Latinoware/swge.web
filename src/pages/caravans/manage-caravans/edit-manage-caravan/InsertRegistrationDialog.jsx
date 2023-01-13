import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import CaravanType from '../../../../enums/CaravanType';
import ServerSideList from '../../../../components/server-side-list/ServerSideList';
import UserService from '../../../../services/UserService';
import CustomDialog from '../../../../components/custom-dialog/CustomDialog';
import useLocation from '../../../../components/hook/useLocation';
import TutoredUserService from '../../../../services/TutoredUserService';
import InsertTutoredUserDialog from './InsertTutoredUserDialog';
import { FLUX_INSTITUTIONS, FLUX_TUTORED_USERS, FLUX_USERS } from '../../../../components/context/FluxContext';

const InsertRegistrationDialog = (props) => {
  const { openDialog, setOpenDialog, handleInsertTutored, handleInsertSingleTutored, handleInsertGeneral, caravanType } = props;

  const { t } = useTranslation();
  const { getCountryName, formatState } = useLocation();

  const [dataUser, setDataUser] = useState([]);
  const [dataTutoredUser, setDataTutoredUser] = useState([]);
  const [openTutoredDialog, setOpenTutoredDialog] = useState(false);
  const [editTutoredUserData, setEditTutoredUserData] = useState(null);

  const userFluxListeners = useMemo(() => [FLUX_USERS, FLUX_INSTITUTIONS], []);
  const tutoredUserFluxListeners = useMemo(() => [FLUX_TUTORED_USERS], []);

  const columnsUser = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.userList.columns.name'),
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
        name: 'country',
        label: t('pages.userList.columns.country'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (country) => getCountryName(country),
          },
          customFilterListOptions: {
            render: (country) => getCountryName(country),
          },
          customBodyRenderLite: (dataIndex) => getCountryName(dataUser[dataIndex].country),
        },
      },
      {
        name: 'state',
        label: t('pages.userList.columns.state'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customFilterListOptions: {
            render: (value) => (formatState(value) == null || formatState(value) === '' ? t(`enums.empty.EMPTY`) : formatState(value)),
          },
          customBodyRenderLite: (dataIndex) =>
            formatState(dataUser[dataIndex].state) == null || formatState(dataUser[dataIndex].state) === ''
              ? '-'
              : formatState(dataUser[dataIndex].state),
        },
      },
      {
        name: 'city',
        label: t('pages.userList.columns.city'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) =>
            dataUser[dataIndex].city == null || dataUser[dataIndex].city === '' ? '-' : dataUser[dataIndex].city,
        },
      },
      {
        name: 'institution.name',
        label: t('pages.userList.columns.institution'),
        options: {
          filter: false,
          filterOptions: {
            renderValue: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customFilterListOptions: {
            render: (value) => (value == null || value === '' ? t(`enums.empty.EMPTY`) : value),
          },
          customBodyRenderLite: (dataIndex) =>
            dataUser[dataIndex].institution?.name == null || dataUser[dataIndex].institution?.name === ''
              ? '-'
              : dataUser[dataIndex].institution.name,
        },
      },
    ],
    [dataUser, formatState, getCountryName, t]
  );

  const columnsTutoredUser = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.editManageCaravan.tutoredUserTable.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'idNumber',
        label: t('pages.editManageCaravan.tutoredUserTable.columns.idNumber'),
        options: {
          filter: true,
        },
      },
      {
        name: 'country',
        label: t('pages.editManageCaravan.tutoredUserTable.columns.country'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (country) => getCountryName(country),
          },
          customFilterListOptions: {
            render: (country) => getCountryName(country),
          },
          customBodyRenderLite: (dataIndex) => getCountryName(dataTutoredUser[dataIndex].country),
        },
      },
    ],
    [dataTutoredUser, getCountryName, t]
  );

  const optionsUser = {
    customToolbarSelect: (selectedRows) => (
      <Box paddingRight={1}>
        <Tooltip title={t('pages.editManageCaravan.tooltip.add')}>
          <IconButton onClick={() => handleInsertGeneral(selectedRows.data.map((p) => dataUser[p.dataIndex].id))}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  const optionsTutoredUser = {
    customToolbarSelect: (selectedRows) => (
      <Box paddingRight={1}>
        <Tooltip title={t('pages.editManageCaravan.tooltip.add')}>
          <IconButton onClick={() => handleInsertTutored(selectedRows.data.map((p) => dataTutoredUser[p.dataIndex].id))}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    customToolbar: () => (
      <Tooltip title={t('pages.editManageCaravan.tooltip.add')}>
        <IconButton onClick={() => setOpenTutoredDialog(true)}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
    onRowClick: (rowData, rowMeta) => {
      setEditTutoredUserData({ data: dataTutoredUser[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenTutoredDialog(true);
    },
  };

  const handleInsertTutoredUser = (userForm) => {
    handleInsertSingleTutored(userForm);
    setOpenDialog(false);
  };

  return (
    <>
      {openTutoredDialog && (
        <InsertTutoredUserDialog
          openDialog={openTutoredDialog}
          setOpenDialog={setOpenTutoredDialog}
          handleInsertTutored={handleInsertTutoredUser}
          formData={editTutoredUserData?.data}
          setFormData={setEditTutoredUserData}
        />
      )}
      <CustomDialog
        dialogProps={{ maxWidth: 'lg' }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={t('pages.editManageCaravan.insertDialogTitle')}
        disableEscapeKeyDown
        content={
          <Box display="flex" p={0} flexWrap="wrap" width="100%" minWidth="400px">
            <Box width="100%" p={1}>
              {caravanType === CaravanType.getValue('GENERAL') ? (
                <ServerSideList
                  columns={columnsUser}
                  options={optionsUser}
                  data={dataUser}
                  setData={setDataUser}
                  enableDefaultUseEffect
                  textLabelsCod="userList"
                  defaultService={UserService}
                  defaultSortOrder={{ name: 'name', direction: 'asc' }}
                  fluxListeners={userFluxListeners}
                />
              ) : (
                <ServerSideList
                  columns={columnsTutoredUser}
                  options={optionsTutoredUser}
                  data={dataTutoredUser}
                  setData={setDataTutoredUser}
                  enableDefaultUseEffect
                  textLabelsCod="editManageCaravan.tutoredUserTable"
                  defaultService={TutoredUserService}
                  defaultSortOrder={{ name: 'name', direction: 'asc' }}
                  fluxListeners={tutoredUserFluxListeners}
                />
              )}
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default InsertRegistrationDialog;
