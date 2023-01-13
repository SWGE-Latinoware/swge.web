import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import BoxW from '../../../components/wrapper/BoxW';
import useLocation from '../../../components/hook/useLocation';
import { SimpleContentDisplay } from '../my-registration/ActivityCard';

const DialogRegistration = (props) => {
  const { openDialog, setOpenDialog, formData } = props;

  const { t } = useTranslation();

  const { formatCurrency, formatLocaleString } = useLocation();

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={t('pages.registrationList.registrationDialog.title')}
      content={
        <BoxW display="flex" p={1} flexWrap="wrap" width="100%" minWidth="400px">
          <SimpleContentDisplay
            leftItem={t('pages.registrationList.columns.user')}
            rightItem={formData.tutoredUser ? formData.tutoredUser.name : formData.user.name}
          />

          <SimpleContentDisplay
            leftItem={t('pages.registrationList.columns.registrationDateTime')}
            rightItem={formatLocaleString(formData.registrationDateTime)}
          />

          <SimpleContentDisplay leftItem={t('pages.registrationList.columns.price')} rightItem={formatCurrency(formData.finalPrice)} />

          <SimpleContentDisplay
            leftItem={t('pages.registrationList.columns.payed')}
            rightItem={t(`enums.payed.${formData.payed ? 'PAYED' : 'NOT_PAYED'}`)}
          />

          <Box paddingTop={2} display="flex" width="100%" flexWrap="wrap" flexDirection="row">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.registrationList.registrationActivity.activityUser')}
            </Typography>
            {formData.individualRegistrations.map(({ activity }) => (
              <BoxW display="flex" width="100%" key={activity?.id}>
                <SimpleContentDisplay rightItem={activity?.name} />
              </BoxW>
            ))}
          </Box>
        </BoxW>
      }
    />
  );
};

export default DialogRegistration;
