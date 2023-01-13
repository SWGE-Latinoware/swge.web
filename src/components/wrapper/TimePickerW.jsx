import React from 'react';
import TimePicker from '@mui/lab/TimePicker';
import { TextField } from '@mui/material';

const TimePickerW = (props) => {
  const {
    error, helperText, required, ...otherProps
  } = props;

  return (
    <TimePicker
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="outlined"
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      onChange={() => {}}
      {...otherProps}
    />
  );
};

export default TimePickerW;
