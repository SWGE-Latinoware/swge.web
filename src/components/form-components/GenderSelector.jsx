import React from 'react';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Selector from './Selector';
import Gender from '../../enums/Gender';

const GenderSelector = (props) => {
  const { t } = useTranslation();

  return (
    <Selector
      {...props}
    >
      {Gender.enums.map((item) => (
        <MenuItem key={item.key} value={item.value}>{t(`enums.genders.${item.key}`)}</MenuItem>
      ))}
    </Selector>
  );
};

export default GenderSelector;
