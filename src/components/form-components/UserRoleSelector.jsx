import React from 'react';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserRoleType from '../../enums/UserRoleType';
import Selector from './Selector';

const UserRoleSelector = (props) => {
  const { t } = useTranslation();

  return (
    <Selector
      {...props}
    >
      {UserRoleType.enums.map((item) => (
        <MenuItem key={item.key} value={item.value}>{t(`enums.userRoleType.${item.key}`)}</MenuItem>
      ))}
    </Selector>
  );
};

export default UserRoleSelector;
