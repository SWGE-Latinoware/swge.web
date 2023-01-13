import React from 'react';
import { AppBar, Box, Hidden, IconButton, Toolbar } from '@mui/material';
import ArrowBackIcons from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router';
import LanguageMenu from '../language-menu/LanguageMenu';
import DarkModeSwitch from '../../dark-mode-switch/DarkModeSwitch';
import { FlexGrow, getHoverColors } from '../../context/ThemeChangeContext';

const CustomTopbar = (props) => {
  const { applicationName, hasArrowBack, goBack } = props;

  const history = useHistory();

  return (
    <AppBar
      sx={(theme) => ({
        position: 'relative',
        justifyContent: 'center',
        minHeight: 54,
        backgroundColor: theme.palette.appBar.backgroundColor,
        width: '100%',
        top: 0,
        right: 0,
      })}
    >
      <Toolbar
        sx={{
          paddingRight: '24px',
        }}
      >
        {hasArrowBack && (
          <IconButton
            color="inherit"
            onClick={() => (goBack ? goBack() : history.push('/login'))}
            sx={(theme) => ({
              marginRight: theme.spacing(0),
              '&:hover': {
                ...getHoverColors(theme.palette.appBar.backgroundColor),
              },
            })}
          >
            <ArrowBackIcons />
          </IconButton>
        )}
        <Box
          sx={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {applicationName}
        </Box>
        <FlexGrow />
        <Hidden xsDown>
          <DarkModeSwitch />
          <LanguageMenu />
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default CustomTopbar;
