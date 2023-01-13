import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import ButtonW from '../../../components/wrapper/ButtonW';
import TitleCard from '../../../components/title-card/TitleCard';
import URLService from '../../../services/URLService';
import CustomTopbar from '../../../components/layouts/custom-topbar/CustomTopbar';
import HelmetW from '../../../components/wrapper/HelmetW';

const EmailConfirmation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { url } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [isOkay, setOkay] = useState(false);

  useEffect(() => {
    if (url) {
      setLoading(true);
      URLService.callURL(url).then((response) => {
        if (response.status === 200) {
          setOkay(true);
        } else {
          setOkay(false);
        }
        setLoading(false);
      });
    }
  }, [url]);

  return (
    <>
      <CustomTopbar hasArrowBack applicationName={t('general.applicationName')} />
      <HelmetW title={t('pages.emailConfirmation.toolbar.emailConfirmation')} />
      <Box
        sx={{
          width: '100vw',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          top: 0,
          left: 0,
        }}
      >
        <Box
          sx={{
            width: '50%',
            height: 'min-content',
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
              }}
            >
              <CircularProgress size={70} />
            </Box>
          ) : (
            <TitleCard title={t('pages.emailConfirmation.toolbar.emailConfirmation')} cardProps={{ elevation: 8 }} boxProps={{ p: 1 }}>
              <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
                <Box width="100%" p={1} justifyContent="center" display="flex">
                  <Typography variant="h3">{t(`pages.emailConfirmation.${isOkay ? 'confirmed' : 'notConfirmed'}`)}</Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="row" p={1} width="100%" justifyContent="center">
                <Box p={1} width="25%">
                  <ButtonW fullWidth primary onClick={() => history.push('/')}>
                    {t('pages.emailConfirmation.cancel')}
                  </ButtonW>
                </Box>
              </Box>
            </TitleCard>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EmailConfirmation;
