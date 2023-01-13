import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../components/toolbar/Toolbar';
import ServerSideList from '../../components/server-side-list/ServerSideList';
import { StyledCard } from '../../components/context/ThemeChangeContext';
import VoucherService from '../../services/VoucherService';
import InsertVoucherDialog from './InsertVoucherDialog';
import { FLUX_VOUCHERS } from '../../components/context/FluxContext';

const VoucherList = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editContentData, setEditContentData] = useState(null);

  const columns = useMemo(
    () => [
      {
        name: 'userEmail',
        label: t('pages.voucherList.columns.userEmail'),
        options: {
          filter: true,
        },
      },
      {
        name: 'edition.name',
        label: t('pages.voucherList.columns.editionName'),
        options: {
          filter: true,
        },
      },
      {
        name: 'edition.year',
        label: t('pages.voucherList.columns.editionYear'),
        options: {
          filter: true,
        },
      },
    ],
    [t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.voucherList.tooltip.add')}>
        <IconButton
          onClick={() => {
            setEditContentData(null);
            setOpenDialog(true);
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    ),
    onRowClick: (rowData, rowMeta) => {
      setEditContentData({ data: data[rowMeta.dataIndex], index: rowMeta.dataIndex });
      setOpenDialog(true);
    },
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.voucher')]} hasArrowBack />
      {openDialog && (
        <InsertVoucherDialog
          {...{
            openDialog,
            setOpenDialog,
          }}
          formData={editContentData?.data}
          dataIndex={editContentData?.index}
        />
      )}
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
            textLabelsCod="voucherList"
            defaultOnRowClickURL="/cli/voucher"
            defaultService={VoucherService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultSortOrder={{ name: 'userEmail', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_VOUCHERS], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default VoucherList;
