import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Toolbar from '../../components/toolbar/Toolbar';
import List from '../../components/list/List';
import { StyledCard } from '../../components/context/ThemeChangeContext';

const AuditList = () => {
  const { t } = useTranslation();

  const columns = useMemo(() => [
    {
      name: 'timestamp',
      label: t('pages.audit.columns.timestamp'),
      options: {
        filter: true,
        customBodyRender: (date) => date.toLocaleString(),
      },
    },
    {
      name: 'action',
      label: t('pages.audit.columns.action'),
      options: {
        filter: true,
      },
    },
    {
      name: 'description',
      label: t('pages.audit.columns.description'),
      options: {
        filter: true,
      },
    },
    {
      name: 'agent',
      label: t('pages.audit.columns.agent'),
      options: {
        filter: true,
      },
    },
    {
      name: 'result',
      label: t('pages.audit.columns.result'),
      options: {
        filter: true,
      },
    },
  ], [t]);

  const options = {
    download: true,
    print: true,
    selectableRows: 'none',
  };

  const data = [
    [new Date(), 'Login', 'Realizar login na plataforma', 'Usuário xyz', 200],
    [new Date('2021-07-16T12:00:31.949Z'), 'Cadastro - Usuário', 'Inserir novo usuário', 'Usuário www', 500],
    [new Date('2021-06-12T18:14:55.949Z'), 'Remoçao - Usuário', 'Apagar usuário', 'Usuário yyy', 200],
  ];

  return (
    <>
      <Toolbar title={t('pages.audit.toolbar.title')} hasArrowBack />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="audit"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default AuditList;
