import React from 'react';
import { Box } from '@mui/material';

const TabPanel = (props) => {
  const {
    children, value, index, primary, secondary, p, ...otherProps
  } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      bgcolor="inherit"
      {...otherProps}
    >
      {value === index && (
      <Box p={p || 3}>
        {children}
      </Box>
      )}
    </Box>
  );
};

export default TabPanel;
