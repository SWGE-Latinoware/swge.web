import React from 'react';
import { IconButton, TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { InputAdornmentStyled } from '../wrapper/TextFieldW';
import useFormUtils from '../hook/useFormUtils';

const Selector = (props) => {
  const { children, error, helperText, required, value, onChange, clear, ...otherProps } = props;
  const { getHelperText } = useFormUtils();

  return (
    <TextField
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      variant="outlined"
      error={error != null}
      helperText={getHelperText(error)}
      required={required}
      InputProps={{
        startAdornment:
          value !== '' && clear ? (
            <InputAdornmentStyled tabIndex={-1} position="start">
              <IconButton onClick={() => onChange({ target: { value: '' } })}>
                <Clear />
              </IconButton>
            </InputAdornmentStyled>
          ) : undefined,
      }}
      onChange={onChange}
      value={value}
      {...otherProps}
      select
    >
      {children}
    </TextField>
  );
};

export default Selector;
