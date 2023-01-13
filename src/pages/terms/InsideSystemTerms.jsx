import { useTranslation } from 'react-i18next';
import React from 'react';
import { useParams } from 'react-router';
import TermComponent from './TermComponent';
import Toolbar from '../../components/toolbar/Toolbar';
import BoxW from '../../components/wrapper/BoxW';
import { StyledCard } from '../../components/context/ThemeChangeContext';

const InsideSystemTerms = () => {
  const { termName } = useParams();
  const { t } = useTranslation();

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
      <Toolbar title={[t(`layouts.sidebar.${titleName()}`)]} hasArrowBack />
      <BoxW p={2} width="100%" display="flex" flexDirection="column">
        <StyledCard p={0} elevation={4} sx={{ maxWidth: '1600px' }}>
          <BoxW width="100%" p={1} display="flex" justifyContent="center" minHeight="90%">
            <TermComponent termName={termName} title={[t(`layouts.sidebar.${titleName()}`)]} />
          </BoxW>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default InsideSystemTerms;
