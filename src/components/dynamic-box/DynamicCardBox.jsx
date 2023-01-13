import React from 'react';
import { Rnd } from 'react-rnd';
import { Box, Card } from '@mui/material';

const DynamicCardBox = (props) => {
  const {
    rndProps, children, cardProps,
  } = props;

  return (
    <Box height="0px" width="0px">
      <Rnd
        sx={{ zIndex: 3000000, position: 'relative' }}
        default={{
          x: 0,
          y: 0,
          width: 350,
          height: 250,
        }}
        minWidth={300}
        minHeight={200}
        {...rndProps}
      >
        <Card elevation={4} sx={{ height: '100%', width: '100%' }} {...cardProps}>
          {children}
        </Card>
      </Rnd>
    </Box>
  );
};

export default DynamicCardBox;
