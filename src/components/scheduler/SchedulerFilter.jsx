import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import BoxW from '../wrapper/BoxW';
import SpaceAutoComplete from '../form-components/SpaceAutoComplete';
import TrackAutoComplete from '../form-components/TrackAutoComplete';
import SpeakerAutoComplete from '../form-components/SpeakerAutoComplete';
import { useEditionChange } from '../context/EditionChangeContext';
import ResponsibleAutoComplete from '../form-components/ResponsibleAutoComplete';

const SchedulerFilter = (props) => {
  const { children, enableFilter, filter } = props;

  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();

  const { control, watch, setValue } = useForm({
    mode: 'onBlur',
  });

  const speakerFilter = watch('speaker', undefined);
  const trackFilter = watch('track', undefined);
  const placeFilter = watch('place', undefined);
  const responsibleFilter = watch('responsible', undefined);

  useEffect(() => {
    if (enableFilter && filter) {
      filter({
        speaker: speakerFilter,
        track: trackFilter,
        place: placeFilter,
        responsible: responsibleFilter,
      });
    }
  }, [speakerFilter, trackFilter, placeFilter, filter, enableFilter, responsibleFilter]);

  useEffect(() => {
    if (!enableFilter && filter) {
      filter({
        speaker: undefined,
        track: undefined,
        place: undefined,
        responsible: undefined,
      });
      setValue('speaker', undefined);
      setValue('track', undefined);
      setValue('place', undefined);
      setValue('responsible', undefined);
    }
  }, [enableFilter, filter, setValue]);

  return (
    <Box sx={() => ({ borderRadius: 1.3, textAlign: 'center' })}>
      {enableFilter && (
        <Box width="100%" p={1} display="flex" flexWrap="wrap">
          <BoxW width="25%" p={1}>
            <Controller
              name="place"
              render={({ field }) => (
                <SpaceAutoComplete institutionId={currentEdition?.institution?.id} label={t('pages.editActivity.place')} {...field} />
              )}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="25%" p={1}>
            <Controller
              name="track"
              render={({ field }) => <TrackAutoComplete label={t('pages.editActivity.track')} {...field} />}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="25%" p={1}>
            <Controller
              name="speaker"
              render={({ field }) => <SpeakerAutoComplete label={t('pages.editActivity.speaker')} {...field} />}
              defaultValue=""
              control={control}
            />
          </BoxW>
          <BoxW width="25%" p={1}>
            <Controller
              name="responsible"
              render={({ field }) => <ResponsibleAutoComplete label={t('pages.editActivity.responsibleUser')} {...field} />}
              defaultValue=""
              control={control}
            />
          </BoxW>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default SchedulerFilter;
