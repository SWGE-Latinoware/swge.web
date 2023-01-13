import React from 'react';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import useFormUtils from '../hook/useFormUtils';

const DateTimePickerW = (props) => {
  const { error, helperText, required, inputProps, onChange, onBlur, ...otherProps } = props;

  const { getHelperText } = useFormUtils();

  return (
    <DateTimePicker
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="outlined"
          error={error != null}
          helperText={getHelperText(error)}
          required={required}
          {...inputProps}
        />
      )}
      onChange={(date) => {
        onChange(date);
        onBlur();
      }}
      {...otherProps}
    />
  );
};

export default DateTimePickerW;
