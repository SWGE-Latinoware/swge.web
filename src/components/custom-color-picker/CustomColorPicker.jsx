import React from 'react';
import { ColorPicker } from 'material-ui-color';
import { MuiThemeProvider } from '@material-ui/core';
import { useThemeChange } from '../context/ThemeChangeContext';

const CustomColorPicker = (props) => {
  const {
    value, onChange, ...otherProps
  } = props;

  const { currentTheme } = useThemeChange();

  const handleChange = (_value) => {
    const strHex = _value.hex ? `#${_value.hex}` : _value;
    onChange(strHex);
  };

  return (
  // TODO remove this workaround
    <MuiThemeProvider theme={currentTheme}>
      <ColorPicker
        value={value}
        onChange={handleChange}
        defaultValue=""
        {...otherProps}
      />
    </MuiThemeProvider>
  );
};

export default CustomColorPicker;
