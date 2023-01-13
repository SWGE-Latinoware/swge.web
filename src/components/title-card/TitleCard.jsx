import React from 'react';
import {
  AppBar, Box, Card, Typography,
} from '@mui/material';

const TitleCard = (props) => {
  const {
    cardProps, title, titleComponent: TitleComponent, children, appBarProps, boxProps,
  } = props;

  return (
    <Card elevation={4} {...cardProps}>
      <AppBar
        position="relative"
        sx={(theme) => ({
          backgroundColor: theme.palette.titleCard.backgroundColor,
          padding: 2,
        })}
        {...appBarProps}
      >
        {TitleComponent || (
          <Typography variant="subtitle1" sx={(theme) => ({ color: theme.palette.titleCard.color })}>{title}</Typography>
        )}
      </AppBar>
      <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <Box width="100%" {...boxProps}>
          {children}
        </Box>
      </Box>
    </Card>
  );
};

export default TitleCard;
