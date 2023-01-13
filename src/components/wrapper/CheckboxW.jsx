import React from 'react';
import { Checkbox, Tooltip } from '@mui/material';

const CheckboxW = (props) => {
  const { primary, tooltipText } = props;

  return (
    <Tooltip title={tooltipText}>
      <div>
        <Checkbox color={primary ? 'primary' : 'secondary'} {...props} />
      </div>
    </Tooltip>
  );
};

export default CheckboxW;
