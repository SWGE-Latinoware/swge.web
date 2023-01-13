import React from 'react';
import { InputAdornment, styled, TextField } from '@mui/material';
import useFormUtils from '../hook/useFormUtils';

export const InputAdornmentStyled = styled(InputAdornment)(({ theme }) => ({
  color: theme.palette.action.active,
}));

const TextFieldW = (props) => {
  const { prefix, suffix, readOnly, error, ...otherProps } = props;
  const { getHelperText } = useFormUtils();

  return (
    <TextField
      variant="outlined"
      autoComplete="off"
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      error={error != null}
      helperText={getHelperText(error)}
      {...otherProps}
      InputProps={{
        startAdornment:
          prefix != null ? (
            <InputAdornmentStyled tabIndex={-1} position="start">
              {prefix}
            </InputAdornmentStyled>
          ) : undefined,
        endAdornment:
          suffix != null ? (
            <InputAdornmentStyled tabIndex={-1} position="end">
              {suffix}
            </InputAdornmentStyled>
          ) : undefined,
        readOnly,
      }}
    />
  );
};

export default TextFieldW;
