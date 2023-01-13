import React from 'react';
import { Switch } from '@mui/material';

const SwitchW = (props) => {
  const {
    primary, secondary, className, children, size, ...otherProps
  } = props;

  return (
    <Switch
      variant={size && size === 'big' ? 'big' : undefined}
      size={size === 'big' ? undefined : size}
      color={primary ? 'primary' : 'secondary'}
      {...otherProps}
    >
      {children}
    </Switch>
  );
};

export default SwitchW;
