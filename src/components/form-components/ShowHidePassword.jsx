import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextFieldW from '../wrapper/TextFieldW';

const ShowHidePassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextFieldW
      type={!showPassword && 'password'}
      suffix={(
        <IconButton tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
        </IconButton>
                )}
      {...props}
    />
  );
};

export default ShowHidePassword;
