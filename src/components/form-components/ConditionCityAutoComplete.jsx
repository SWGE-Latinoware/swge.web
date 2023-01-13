import React from 'react';
import TextFieldW from '../wrapper/TextFieldW';
import ConditionComponent from './ConditionComponent';
import CityAutoComplete from './CityAutoComplete';

const ConditionCityAutoComplete = (props) => {
  const {
    textFieldProps, autoCompleteProps, ...otherProps
  } = props;

  return (
    <ConditionComponent
      TrueComponent={CityAutoComplete}
      FalseComponent={TextFieldW}
      trueProps={autoCompleteProps}
      falseProps={textFieldProps}
      {...otherProps}
    />
  );
};

export default ConditionCityAutoComplete;
