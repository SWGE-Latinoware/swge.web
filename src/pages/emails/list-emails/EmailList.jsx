import React, { useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Toolbar from '../../../components/toolbar/Toolbar';
import List from '../../../components/list/List';
import SwitchW from '../../../components/wrapper/SwitchW';
import { StyledCard } from '../../../components/context/ThemeChangeContext';

const EmailList = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const columns = useMemo(() => [
    {
      name: 'subject',
      label: t('pages.emailList.columns.subject'),
      options: {
        filter: true,
      },
    },
    {
      name: 'timestamp',
      label: t('pages.emailList.columns.timestamp'),
      options: {
        filter: true,
        customBodyRender: (date) => date.toLocaleString(),
      },
    },
    {
      name: 'class',
      label: t('pages.emailList.columns.class'),
      options: {
        filter: true,
      },
    },
    {
      name: 'status',
      label: t('pages.emailList.columns.status'),
      options: {
        filter: true,
      },
    },
    {
      name: 'enable',
      label: t('pages.emailList.columns.enable'),
      options: {
        filter: false,
        sort: false,
        customBodyRender: (enable) => (
          <SwitchW
            defaultChecked={enable}
            disabled={!enable}
            name="enable"
            primary
          />
        ),
      },
    },
  ], [t]);

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.emailList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edit-email')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const data = [
    ['Email de agradecimento aos inscritos', new Date(), 'Inscritos', 'Esperando', true],
    ['Aviso para caravana tal', new Date('2021-07-16T12:00:31.949Z'), 'Caravanas', 'Enviado', false],
  ];

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.communication'),
          t('layouts.sidebar.emails'),
        ]}
        hasArrowBack
      />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="emailList"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default EmailList;
