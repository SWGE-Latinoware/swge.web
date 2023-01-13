import React from 'react';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Selector from './Selector';
import FeedbackStatus from '../../enums/FeedbackStatus';

const FeedbackStatusSelector = (props) => {
  const { t } = useTranslation();

  return (
    <Selector
      {...props}
    >
      {FeedbackStatus.enums.map((item) => (
        <MenuItem key={item.key} value={item.value}>{t(`enums.feedbackStatus.${item.key}`)}</MenuItem>
      ))}
    </Selector>
  );
};

export default FeedbackStatusSelector;
