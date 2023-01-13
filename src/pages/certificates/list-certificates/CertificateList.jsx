import React, { useMemo, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import Toolbar from '../../../components/toolbar/Toolbar';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import CertificateService from '../../../services/CertificateService';
import useCertificate from '../../../components/hook/useCertificate';
import useLocation from '../../../components/hook/useLocation';
import { FLUX_CERTIFICATES } from '../../../components/context/FluxContext';
import ServerSideList from '../../../components/server-side-list/ServerSideList';

const CertificateList = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { certificateList } = useCertificate();
  const { formatLocaleString } = useLocation();

  const [data, setData] = useState(certificateList);

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.certificateList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'availabilityDateTime',
        label: t('pages.certificateList.columns.availability'),
        options: {
          filter: false,
          customBodyRender: (date) => formatLocaleString(date),
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
    [formatLocaleString, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.certificateList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/certificate')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.records'), t('layouts.sidebar.certificates')]} hasArrowBack />
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
            textLabelsCod="certificateList"
            defaultOnRowClickURL="/cli/certificate"
            defaultService={CertificateService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            editionBasedMandatoryField="edition.id"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_CERTIFICATES], [])}
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default CertificateList;
