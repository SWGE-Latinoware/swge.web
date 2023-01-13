import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useSpeaker from '../hook/useSpeaker';

const SpeakerAutoComplete = (props) => {
  const { speakerIds, getSpeakerNameById } = useSpeaker();
  return <AutoCompleteW options={speakerIds || []} getOptionLabel={(o) => getSpeakerNameById(o)} {...props} />;
};

export default SpeakerAutoComplete;
