import React from 'react';
import TextFieldW from '../wrapper/TextFieldW';
import ConditionComponent from './ConditionComponent';
import StateAutoComplete from './StateAutoComplete';

const ConditionStateAutoComplete = (props) => {
  const { textFieldProps, autoCompleteProps, ...otherProps } = props;

  return (
    <ConditionComponent
      TrueComponent={StateAutoComplete}
      FalseComponent={TextFieldW}
      trueProps={autoCompleteProps}
      falseProps={textFieldProps}
      {...otherProps}
    />
  );
};

export default ConditionStateAutoComplete;
