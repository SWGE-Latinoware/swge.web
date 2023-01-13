import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useLocation from '../../../components/hook/useLocation';
import RegistrationService from '../../../services/RegistrationService';
import { FLUX_REGISTRATIONS } from '../../../components/context/FluxContext';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import DialogRegistration from './DialogRegistration';

const RegistrationListPanel = () => {
  const { t } = useTranslation();

  const { formatCurrency, formatLocaleString } = useLocation();

  const [data, setData] = useState([]);
  const [dataRegistration, setDataRegistration] = useState(undefined);
  const [openRegistration, setOpenRegistration] = useState(false);

  const columns = useMemo(
    () => [
      {
        name: 'user.name',
        label: t('pages.registrationList.columns.user'),
        options: {
          filter: true,
        },
      },
      {
        name: 'registrationDateTime',
        label: t('pages.registrationList.columns.registrationDateTime'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
        },
      },
      {
        name: 'finalPrice',
        label: t('pages.registrationList.columns.price'),
        options: {
          filter: false,
          customBodyRender: (price) => formatCurrency(price),
        },
      },
      {
        name: 'payed',
        label: t('pages.registrationList.columns.payed'),
        options: {
          filter: true,
          filterOptions: {
            renderValue: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customFilterListOptions: {
            render: (payed) => t(`enums.payed.${payed ? 'PAYED' : 'NOT_PAYED'}`),
          },
          customBodyRenderLite: (index) => t(`enums.payed.${data[index].payed ? 'PAYED' : 'NOT_PAYED'}`),
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
    [data, formatCurrency, formatLocaleString, t]
  );

  const options = {
    onRowClick: (rowData, rowMeta) => {
      setDataRegistration({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenRegistration(true);
    },
  };

  return (
    <>
      {openRegistration && (
        <DialogRegistration openDialog={openRegistration} setOpenDialog={setOpenRegistration} formData={dataRegistration?.data} />
      )}
      <ServerSideList
        {...{
          columns,
          data,
          setData,
          options,
        }}
        enableDefaultUseEffect
        textLabelsCod="registrationList"
        defaultService={RegistrationService}
        onRowsDeleteErrorToast="toastes.deletesError"
        onRowsDeleteToast="toastes.deletes"
        editionBasedMandatoryField="edition.id"
        defaultSortOrder={{ name: 'registrationDateTime', direction: 'desc' }}
        fluxListeners={useMemo(() => [FLUX_REGISTRATIONS], [])}
      />
    </>
  );
};

export default RegistrationListPanel;
