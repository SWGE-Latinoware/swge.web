import React, { useEffect } from 'react';
import useLocation from '../hook/useLocation';
import AutoCompleteW from '../wrapper/AutoCompleteW';

const CityAutoComplete = (props) => {
  const {
    defaultOnClickSet, watch, setValue, ...otherProps
  } = props;

  const {
    renderCityList,
  } = useLocation();

  const state = watch('state', undefined);

  useEffect(() => {
    setValue('city', undefined);
  }, [setValue, state]);

  return (
    <AutoCompleteW
      options={renderCityList(state)}
      {...otherProps}
    />
  );
};

export default CityAutoComplete;
