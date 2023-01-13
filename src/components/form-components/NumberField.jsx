import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const NumberField = (props) => (
  <TextField
    variant="outlined"
    autoComplete="off"
    type="number"
    InputLabelProps={{
      shrink: true,
    }}
    fullWidth
    {...props}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          {props.prefix}
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          {props.suffix}
        </InputAdornment>
      ),
    }}
  />
);

export default NumberField;
