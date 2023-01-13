import React from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import CustomTopbar from '../../components/layouts/custom-topbar/CustomTopbar';
import BoxW from '../../components/wrapper/BoxW';
import TitleCard from '../../components/title-card/TitleCard';
import DropzoneAreaW from '../../components/wrapper/DropzoneAreaW';
import URLService from '../../services/URLService';
import { useToast } from '../../components/context/toast/ToastContext';
import HelmetW from '../../components/wrapper/HelmetW';

const CertificateValidation = () => {
  const { fragment } = useParams();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const handleValidation = (file) => {
    if (file == null) return;

    const form = new FormData();
    const parts = file.name.split('.');
    form.append('name', file.name.replace(`.${parts[parts.length - 1]}`, ''));
    if (parts.length > 1) {
      form.append('format', parts[parts.length - 1]);
    }
    form.append('file', file);
    URLService.validateFile(fragment, form).then((response) => {
      if (response.status === 200) {
        if (response.data) addToast({ body: t('toastes.certificateValidated'), type: 'success' });
        else addToast({ body: t('toastes.invalidCertificate'), type: 'error' });

        return;
      }

      addToast({ body: t('toastes.errorGetData'), type: 'error' });
    });
  };

  return (
    <>
      <CustomTopbar hasArrowBack applicationName={t('general.applicationName')} />
      <HelmetW title={t('pages.certificateValidation.toolbar.validation')} />
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
          <TitleCard
            title={`${t('pages.certificateValidation.toolbar.validation')} - ${fragment}`}
            cardProps={{ elevation: 8 }}
            boxProps={{ p: 1 }}
          >
            <BoxW p={1} width="100%">
              <DropzoneAreaW
                dropzoneText={t('pages.editCertificate.certificatePDF.dropzoneText')}
                onChange={(files) => handleValidation(files[0])}
                acceptedFiles={['application/pdf']}
              />
            </BoxW>
          </TitleCard>
        </Box>
      </Box>
    </>
  );
};

export default CertificateValidation;
