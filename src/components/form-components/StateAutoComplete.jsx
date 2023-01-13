import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useLocation from '../hook/useLocation';

const StateAutoComplete = (props) => {
  const {
    renderStateList, getStateName,
  } = useLocation();
  return (
    <AutoCompleteW
      options={renderStateList() || []}
      getOptionLabel={(o) => getStateName(o)}
      {...props}
    />
  );
};

export default StateAutoComplete;
