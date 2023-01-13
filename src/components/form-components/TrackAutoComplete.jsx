import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useTrack from '../hook/useTrack';

const TrackAutoComplete = (props) => {
  const {
    ...otherProps
  } = props;

  const {
    trackIds, getTrackNameById,
  } = useTrack();

  return (
    <AutoCompleteW
      options={trackIds || []}
      link="/cli/track"
      getOptionLabel={(o) => getTrackNameById(o)}
      {...otherProps}
    />
  );
};

export default TrackAutoComplete;
