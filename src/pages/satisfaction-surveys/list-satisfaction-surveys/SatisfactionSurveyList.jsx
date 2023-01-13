import React, { useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Toolbar from '../../../components/toolbar/Toolbar';
import List from '../../../components/list/List';
import SwitchW from '../../../components/wrapper/SwitchW';
import { StyledCard, TypographyURL } from '../../../components/context/ThemeChangeContext';

const SatisfactionSurveyList = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const columns = useMemo(() => [
    {
      name: 'name',
      label: t('pages.satisfactionSurveyList.columns.name'),
      options: {
        filter: true,
      },
    },
    {
      name: 'url',
      label: t('pages.satisfactionSurveyList.columns.url'),
      options: {
        filter: true,
        customBodyRender: (url) => <a target="_blank" href={url} rel="noreferrer"><TypographyURL>{url}</TypographyURL></a>,
      },
    },
    {
      name: 'status',
      label: t('pages.satisfactionSurveyList.columns.status'),
      options: {
        filter: true,
      },
    },
    {
      name: 'enable',
      label: t('pages.satisfactionSurveyList.columns.enable'),
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
      <Tooltip title={t('pages.satisfactionSurveyList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/satisfaction-survey')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  const data = [
    ['Palestra fulano de tal', 'https://www.google.com/forms/about/', 'Esperando', true],
    ['Evento geral', 'https://www.surveymonkey.com/', 'Enviada', false],
    ['Evento Específico', 'https://forms.office.com/', 'Esperando', true],
  ];

  return (
    <>
      <Toolbar
        title={[
          t('layouts.sidebar.records'),
          t('layouts.sidebar.satisfactionSurveys'),
        ]}
        hasArrowBack
      />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <List
            columns={columns}
            options={options}
            data={data}
            textLabelsCod="satisfactionSurveyList"
          />
        </StyledCard>
      </Box>
    </>
  );
};

export default SatisfactionSurveyList;
