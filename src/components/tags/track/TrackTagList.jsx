import React from 'react';
import { useTranslation } from 'react-i18next';
import useTrack from '../../hook/useTrack';
import BoxW from '../../wrapper/BoxW';
import TrackTag from './TrackTag';

const TrackTagList = () => {
  const { trackList } = useTrack();
  const { t } = useTranslation();

  return (
    <BoxW id="track-list" p={1} width="100%">
      {t('pages.activityList.tracks')}
      <BoxW p={1} display="flex" flexDirection="row" flexWrap="wrap">
        {trackList.map((track) => (
          <TrackTag calendarColor={track.calendarColor} name={track.name} />
        ))}
      </BoxW>
    </BoxW>
  );
};

export default TrackTagList;
