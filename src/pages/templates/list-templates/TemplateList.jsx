import React, { useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Toolbar from '../../../components/toolbar/Toolbar';
import List from '../../../components/list/List';
import { StyledCard } from '../../../components/context/ThemeChangeContext';

const TemplateList = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const columns = useMemo(() => [
    {
      name: 'name',
      label: t('pages.templateList.columns.name'),
      options: {
        filter: true,
      },
    },
    {
      name: 'type',
      label: t('pages.templateList.columns.type'),
      options: {
        filter: true,
      },
    },
  ], [t]);

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.templateList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/edit-template')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const data = [
    ['Email para os inscritos', 'EMAIL'],
    ['Certificado da conferência', 'CERTIFICADO'],
    ['Etiqueta dos Participantes da Conferência', 'ETIQUETA'],
  ];

  return (
    <>
      <Toolbar
        title={
          t('layouts.sidebar.templates')
        }
        hasArrowBack
      />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="templateList"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default TemplateList;
