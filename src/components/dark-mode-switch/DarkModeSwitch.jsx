import React, { useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { Brightness3 as Brightness3Icon, WbSunny as WbSunnyIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import { getHoverColors, useThemeChange } from '../context/ThemeChangeContext';
import { setThemeUser } from '../../services/Auth';

const DarkModeSwitch = (props) => {
  const { buttonMode } = props;

  const { prefersDarkMode, setPrefersDarkMode, setDarkTheme, setLightTheme, defaultLight, defaultDark } = useThemeChange();
  const { t } = useTranslation();

  const handleChange = () => {
    const darkChoice = !prefersDarkMode;
    setPrefersDarkMode(darkChoice);
    setThemeUser(darkChoice);
  };

  useEffect(() => {
    setLightTheme(defaultLight);
    setDarkTheme(defaultDark);
  }, [defaultDark, defaultLight, setDarkTheme, setLightTheme]);

  return buttonMode ? (
    <Button
      id="theme-button"
      fullWidth
      startIcon={prefersDarkMode ? <WbSunnyIcon /> : <Brightness3Icon />}
      variant="text"
      onClick={handleChange}
      {...props}
    >
      <Box>{prefersDarkMode ? t('enums.themeTypes.LIGHT') : t('enums.themeTypes.DARK')}</Box>
    </Button>
  ) : (
    <IconButton
      id="theme-button"
      sx={(theme) => ({
        color: theme.palette.appBar.color,
        padding: '2px',
        margin: '10px',
        width: '40px',
        height: '40px',
        '&:hover': {
          ...getHoverColors(theme.palette.appBar.backgroundColor),
        },
      })}
      onClick={handleChange}
    >
      <Tooltip title={prefersDarkMode ? t('enums.themeTypes.tooltip.light') : t('enums.themeTypes.tooltip.dark')}>
        {prefersDarkMode ? <WbSunnyIcon /> : <Brightness3Icon />}
      </Tooltip>
    </IconButton>
  );
};

export default DarkModeSwitch;
