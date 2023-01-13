import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import CustomTopbar from '../../components/layouts/custom-topbar/CustomTopbar';
import TermComponent from './TermComponent';
import TitleCard from '../../components/title-card/TitleCard';
import HelmetW from '../../components/wrapper/HelmetW';

const OutsideSystemTerms = () => {
  const { termName } = useParams();
  const { t } = useTranslation();

  const history = useHistory();

  const titleName = () => {
    const names = termName.split('-');
    if (names.length === 1) {
      return names[0];
    }
    let result = names[0];
    for (let i = 1; i < names.length; i += 1) {
      result += names[i].replace(names[i][0], names[i][0].toUpperCase());
    }
    return result;
  };

  return (
    <>
      <CustomTopbar hasArrowBack applicationName={t('general.applicationName')} goBack={() => history.goBack()} />
      <HelmetW title={t(`pages.terms.${titleName()}`)} />
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '600px',
          position: 'relative',
          top: 32,
          left: 0,
        }}
      >
        <Box
          sx={{
            width: '70%',
            height: '100%',
            minWidth: '300px',
            minHeight: '300px',
          }}
        >
          <TitleCard title={t(`pages.terms.${titleName()}`)} cardProps={{ elevation: 8 }} boxProps={{ p: 1 }}>
            <TermComponent termName={termName} />
          </TitleCard>
        </Box>
      </Box>
    </>
  );
};

export default OutsideSystemTerms;
