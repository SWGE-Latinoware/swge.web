import React from 'react';
import { Icon } from '@mui/material';

const IconSvg = (props) => {
  const { component, ...otherProps } = props;

  return (
    <Icon component={component} sx={(theme) => ({ color: theme.palette.action.active })} {...otherProps} />
  );
};
export default IconSvg;
