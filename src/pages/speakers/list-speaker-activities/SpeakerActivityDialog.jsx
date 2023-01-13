import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import useRTE from '../../../components/hook/useRTE';
import FlagIcon from '../../../components/flag-icon/FlagIcon';
import { SimpleContentDisplay } from '../../registrations/my-registration/ActivityCard';

const SpeakerActivityDialog = (props) => {
  const { openDialog, setOpenDialog, formData } = props;

  const { t } = useTranslation();
  const { renderFromState } = useRTE();

  return (
    <CustomDialog
      dialogProps={{ maxWidth: 'lg' }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      title={t('pages.speakerActivityList.activityCard.activityDialogTitle')}
      content={
        <Box p={2} width="100%" height="100%">
          <Card
            elevation={4}
            sx={(theme) => ({
              height: '100%',
              display: 'flex',
              padding: theme.spacing(2),
            })}
          >
            <CardContent>
              <Box width="100%" display="flex" flexWrap="wrap" flexDirection="row">
                <SimpleContentDisplay leftItem={t('pages.speakerActivityList.activityCard.name')} rightItem={formData.name} width="50%" />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.responsibleUser')}
                  rightItem={formData.responsibleUser?.name}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.speakers')}
                  rightItem={formData.speakers.map(({ speaker }) => speaker.name).join(', ')}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.type')}
                  rightItem={t(`enums.activityTypes.${formData.type}`)}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.language')}
                  rightItem={
                    <Box display="flex" alignItems="center">
                      {formData.language}
                      {formData.languageFlag && (
                        <Box paddingLeft={1}>
                          <FlagIcon country={formData.languageFlag} height="25px" />
                        </Box>
                      )}
                    </Box>
                  }
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.presentationType')}
                  rightItem={t(`enums.editionTypes.${formData.presentationType}`)}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.track')}
                  rightItem={formData.track.name}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.place')}
                  rightItem={formData.place?.name}
                  width="50%"
                />
                <SimpleContentDisplay
                  leftItem={t('pages.speakerActivityList.activityCard.webPlace')}
                  rightItem={formData.placeUrl}
                  width="50%"
                />
              </Box>
            </CardContent>
          </Card>
          <Box paddingTop={3} width="100%" height="100%">
            <Card
              elevation={4}
              sx={(theme) => ({
                height: '100%',
                display: 'flex',
                padding: theme.spacing(2),
              })}
            >
              {renderFromState(formData.description)}
            </Card>
          </Box>
        </Box>
      }
    />
  );
};

export default SpeakerActivityDialog;
