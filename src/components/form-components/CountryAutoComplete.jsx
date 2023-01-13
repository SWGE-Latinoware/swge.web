import React from 'react';
import useLocation from '../hook/useLocation';
import AutoCompleteW from '../wrapper/AutoCompleteW';

const CountryAutoComplete = (props) => {
  const { defaultOnClickSet, ...otherProps } = props;

  const {
    renderCountryList, getCountryName,
  } = useLocation();

  return (
    <AutoCompleteW
      options={renderCountryList()}
      getOptionLabel={(o) => getCountryName(o)}
      {...otherProps}
    />
  );
};

export default CountryAutoComplete;
