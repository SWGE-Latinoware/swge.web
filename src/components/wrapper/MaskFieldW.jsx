import React from 'react';
import MaskedInput from 'react-text-mask';
import TextFieldW from './TextFieldW';

const MaskFieldW = (props) => (
  <MaskedInput
    {...props}
    render={(ref, _props) => (
      <TextFieldW
        inputRef={ref}
        {..._props}
      />
    )}
  />
);

export default MaskFieldW;
