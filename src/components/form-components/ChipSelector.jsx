import React, { forwardRef, useEffect } from 'react';
import {
  Box, Chip, FormControl, FormHelperText, InputLabel, OutlinedInput, Select as MuiSelect,
} from '@mui/material';

const ChipSelector = forwardRef((props) => {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, [props.label]);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={props.error}
      required={props.required}
    >
      <InputLabel
        htmlFor="outlined-notched"
        shrink
        ref={inputLabel}
      >
        {props.label}
      </InputLabel>
      <MuiSelect
        {...props}
        multiple
        // ref={ref}
        input={(
          <OutlinedInput
            notched
            labelWidth={labelWidth}
            name={props.label}
            id="outlined-notched"
          />
        )}
        renderValue={(selected) => (
          <Box display="flex" flexWrap="wrap">
            {selected.map((value) => (
              <Chip key={value} label={props.enum ? props.enum[value] : value} sx={{ margin: 2 }} />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        {props.children}
      </MuiSelect>
      <FormHelperText>
        {props.helperText}
      </FormHelperText>
    </FormControl>

  );
});

export default ChipSelector;
