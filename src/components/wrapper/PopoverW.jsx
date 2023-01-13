import React from 'react';
import { Popover } from '@mui/material';

const PopoverW = (props) => {
  const { anchorEl, setAnchorEl, anchorPosition, setAnchorPosition, children, ...otherProps } = props;

  const open = anchorEl ? Boolean(anchorEl) : Boolean(anchorPosition);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    if (setAnchorPosition) {
      setAnchorPosition(null);
    }
    if (setAnchorEl) {
      setAnchorEl(null);
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      anchorReference={anchorEl ? 'anchorEl' : 'anchorPosition'}
      anchorPosition={anchorPosition}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...otherProps}
    >
      {children}
    </Popover>
  );
};

export default PopoverW;
