import React from 'react';
import { Fab } from '@mui/material';
import { getHoverColors } from '../context/ThemeChangeContext';

const FabW = (props) => {
  const { children, onClick, ...otherProps } = props;

  return (
    <Fab
      sx={(theme) => ({
        position: 'fixed',
        bottom: 16,
        right: 16,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        '&:hover': {
          ...getHoverColors(theme.palette.primary.main),
        },
      })}
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </Fab>
  );
};

export default FabW;
