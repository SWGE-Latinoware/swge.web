import React from 'react';
import DatePicker from '@mui/lab/DatePicker';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFormUtils from '../hook/useFormUtils';

const DatePickerW = (props) => {
  const { error, helperText, required, onChange, onBlur, ...otherProps } = props;
  const { getHelperText } = useFormUtils();
  const { t } = useTranslation();

  return (
    <DatePicker
      leftArrowButtonText={t('datePicker.prev')}
      rightArrowButtonText={t('datePicker.next')}
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

export default DatePickerW;
