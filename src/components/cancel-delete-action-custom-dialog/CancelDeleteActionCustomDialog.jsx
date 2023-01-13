import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../custom-dialog/CustomDialog';
import BoxW from '../wrapper/BoxW';

const CancelDeleteActionCustomDialog = (props) => {
  const { t } = useTranslation();

  return (
    <CustomDialog
      title={t('cancelDialog.cancelDialogTitle')}
      content={
        <BoxW p={1} width="100%" height="100%" display="flex" flexWrap="wrap">
          <BoxW p={1}>
            <Typography>{t('cancelDialog.cancelDialogContent')}</Typography>
          </BoxW>
        </BoxW>
      }
      buttonText={t('cancelDialog.accept')}
      buttonErrorText={t('cancelDialog.refuse')}
      {...props}
    />
  );
};

export default CancelDeleteActionCustomDialog;
