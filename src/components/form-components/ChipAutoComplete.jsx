import React from 'react';
import { Autocomplete, Box, Checkbox, Paper, TextField } from '@mui/material';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TypographyURL } from '../context/ThemeChangeContext';
import useFormUtils from '../hook/useFormUtils';

const ChipAutoComplete = (props) => {
  const { name, label, inputProps, onChange, link, setLink, setOpenDialog, ...otherProps } = props;
  const { getHelperText } = useFormUtils();

  const { t } = useTranslation();

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
    <Autocomplete
      multiple
      disableCloseOnSelect
      getOptionLabel={(o) => o}
      noOptionsText={t('autoComplete.noOptions')}
      PaperComponent={setOpenDialog && Link}
      renderOption={(_props, option, { selected }) => (
        <div {..._props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ marginRight: 1 }}
            checked={selected}
          />
          {_props.key}
        </div>
      )}
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
      onChange={(_, data) => onChange(data)}
      {...otherProps}
    />
  );
};

export default ChipAutoComplete;
