import React from 'react';
import ConditionComponent from './ConditionComponent';
import TextFieldW from '../wrapper/TextFieldW';
import MaskFieldW from '../wrapper/MaskFieldW';

const ConditionalMaskField = (props) => {
  const { textFieldProps, maskFieldProps, ...otherProps } = props;

  return (
    <ConditionComponent
      TrueComponent={MaskFieldW}
      FalseComponent={TextFieldW}
      trueProps={maskFieldProps}
      falseProps={textFieldProps}
      {...otherProps}
    />
  );
};

export default ConditionalMaskField;
