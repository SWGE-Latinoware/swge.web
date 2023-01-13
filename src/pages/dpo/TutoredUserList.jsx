import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TutoredUserService from '../../services/TutoredUserService';
import ServerSideList from '../../components/server-side-list/ServerSideList';
import useLocation from '../../components/hook/useLocation';
import { FLUX_TUTORED_USERS } from '../../components/context/FluxContext';
import InsertTutoredUserDialog from '../caravans/manage-caravans/edit-manage-caravan/InsertTutoredUserDialog';
import Toolbar from '../../components/toolbar/Toolbar';
import { StyledCard } from '../../components/context/ThemeChangeContext';

const TutoredUserList = () => {
  const { t } = useTranslation();
  const { getCountryName, formatLocaleDateString } = useLocation();

  const [dataTutoredUser, setDataTutoredUser] = useState([]);
  const [openTutoredDialog, setOpenTutoredDialog] = useState(false);
  const [editTutoredUserData, setEditTutoredUserData] = useState(null);

  const tutoredUserFluxListeners = useMemo(() => [FLUX_TUTORED_USERS], []);

  const columnsTutoredUser = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.tutoredUserList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'idNumber',
        label: t('pages.tutoredUserList.columns.idNumber'),
        options: {
          filter: true,
        },
      },
      {
        name: 'country',
        label: t('pages.tutoredUserList.columns.country'),
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
      {
        name: 'exclusionDate',
        label: t('pages.tutoredUserList.columns.exclusionDate'),
        options: {
          filter: false,
          customBodyRenderLite: (dataIndex) => {
            if (dataTutoredUser[dataIndex].exclusionDate)
              return (
                <Typography sx={(theme) => ({ color: theme.palette.error.main })}>
                  {formatLocaleDateString(dataTutoredUser[dataIndex].exclusionDate)}
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
            <IconButton tabIndex={-1}>
              <EditIcon />
            </IconButton>
          ),
        },
      },
    ],
    [dataTutoredUser, formatLocaleDateString, getCountryName, t]
  );

  const options = {
    selectableRows: 'none',
  };

  return (
    <>
      {openTutoredDialog && (
        <InsertTutoredUserDialog
          openDialog={openTutoredDialog}
          setOpenDialog={setOpenTutoredDialog}
          formData={editTutoredUserData?.data}
          setFormData={setEditTutoredUserData}
        />
      )}
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.tutoredUsers')]} hasArrowBack />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <ServerSideList
            columns={columnsTutoredUser}
            options={options}
            data={dataTutoredUser}
            setData={setDataTutoredUser}
            enableDefaultUseEffect
            textLabelsCod="tutoredUserList"
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultService={TutoredUserService}
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={tutoredUserFluxListeners}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default TutoredUserList;
