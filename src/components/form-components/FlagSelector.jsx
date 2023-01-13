import React, { useMemo } from 'react';
import { Box, MenuItem } from '@mui/material';
import { countries } from 'react-circle-flags';
import _ from 'lodash';
import Selector from './Selector';
import FlagIcon from '../flag-icon/FlagIcon';

export const EMPTY_FLAG_VALUE = '__EMPTY__';

const FlagSelector = (props) => {
  const { disableDefault, disableNoFlags, ...otherProps } = props;

  const options = useMemo(() => {
    const allOptions = _.sortBy(_.compact(_.map(countries, (value, key) => {
      if (disableNoFlags) {
        return value ? key : undefined;
      }
      return key;
    })));
    if (!disableDefault) {
      allOptions.push(EMPTY_FLAG_VALUE);
    }
    return allOptions;
  }, [disableDefault, disableNoFlags]);

  return (
    <Selector
      {...otherProps}
    >
      {options?.map((item) => (
        <MenuItem key={item} value={item}>
          <Box display="flex" alignItems="center">
            <Box><FlagIcon country={item} /></Box>
            <Box paddingLeft={1}>{item}</Box>
          </Box>
        </MenuItem>
      ))}
    </Selector>
  );
};

export default FlagSelector;
