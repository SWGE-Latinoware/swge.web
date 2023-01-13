import React, { useEffect, useState } from 'react';
import { Alert as MuiAlert, AlertTitle, Slide, Snackbar } from '@mui/material';

const ToastContainer = ({ title, message, type }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, [message]);

  return (
    <Snackbar
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'right' }}
    >
      <MuiAlert elevation={6} variant="standard" severity={type} title={!!title}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default ToastContainer;
