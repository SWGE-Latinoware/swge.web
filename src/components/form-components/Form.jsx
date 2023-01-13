import React from 'react';
import { Box } from '@mui/material';

const Form = ({ children, ...props }) => (
  <Box component="form" {...props} width="100%" marginTop={1} noValidate autoComplete="off">
    {children}
  </Box>
);

export default Form;
