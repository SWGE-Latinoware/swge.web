import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFormUtils from '../hook/useFormUtils';
import { TypographyURL } from '../context/ThemeChangeContext';

const AutoCompleteW = (props) => {
  const { value, options, inputProps, label, name, onChange, setState, setOpenDialog, setLink, link, ...otherProps } = props;
  const { t } = useTranslation();
  const { getHelperText } = useFormUtils();

  const [realValue, setRealValue] = useState(null);

  useEffect(() => {
    if (options.length > 0 && value != null && value !== '') {
      setRealValue(value);
      return;
    }
    if ((value == null || value === '') && realValue != null && realValue !== '') {
      setRealValue(null);
    }
  }, [options.length, realValue, value]);

  const Link = ({ children, ...other }) => (
    <Paper {...other} style={{ padding: '5px' }}>
      <Box paddingLeft={2} paddingTop={2}>
        <TypographyURL
          variant="body2"
          urlType="secondary"
          urlNoDecorator
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() => {
            setLink(link);
            setOpenDialog(true);
          }}
        >
          {t('autoComplete.addNew')}
        </TypographyURL>
      </Box>
      {children}
    </Paper>
  );

  return (
    <>
      <Autocomplete
        options={options}
        value={realValue}
        getOptionLabel={(o) => o}
        noOptionsText={t('autoComplete.noOptions')}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
            label={label}
            name={name}
            error={inputProps?.error != null}
            helperText={getHelperText(inputProps?.error)}
            {...inputProps}
          />
        )}
        onChange={(_, data) => onChange(data) || (data != null && setState && setState(data))}
        PaperComponent={setOpenDialog && Link}
        {...otherProps}
      />
    </>
  );
};
export default AutoCompleteW;
