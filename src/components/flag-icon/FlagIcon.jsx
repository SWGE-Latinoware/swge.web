import React from 'react';
import { CircleFlag } from 'react-circle-flags';

const FlagIcon = (props) => {
  const {
    country, height, ...otherProps
  } = props;

  return (
    <CircleFlag
      countryCode={country}
      height={height || '35px'}
      {...otherProps}
    />
  );
};

export default FlagIcon;
