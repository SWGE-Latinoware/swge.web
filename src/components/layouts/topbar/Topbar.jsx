import React, { useState } from 'react';
import { AppBar, Box, Hidden, IconButton, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { HelpOutline, MenuOpen } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ActionMenu from '../action-menu/ActionMenu';
import LanguageMenu from '../language-menu/LanguageMenu';
import DarkModeSwitch from '../../dark-mode-switch/DarkModeSwitch';
import EditionMenu from '../edition-menu/EditionMenu';
import { FlexGrow, getHoverColors, useThemeChange } from '../../context/ThemeChangeContext';
import AppBarJoyride from '../../joyride/AppBarJoyride';

const Topbar = (props) => {
  const { toggleSidebar, isDesktop, openSidebar, applicationName } = props;

  const { width } = useThemeChange();
  const { t } = useTranslation();

  const [openJoyride, setOpenJoyride] = useState(false);

  return (
    <AppBar
      sx={(theme) => ({
        position: 'absolute',
        justifyContent: 'center',
        minHeight: '100px',
        backgroundColor: theme.palette.appBar.backgroundColor,
        marginLeft: openSidebar ? '280px' : '0px',
        width: openSidebar ? 'calc(100% - 280px)' : '100%',
        zIndex: theme.zIndex.appBar,
      })}
    >
      <Toolbar sx={{ paddingRight: '24px' }}>
        <IconButton
          id="sidebar-button"
          onClick={toggleSidebar}
          sx={(theme) => ({
            color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
            marginRight: theme.spacing(0),
            '&:hover': {
              ...getHoverColors(theme.palette.appBar.backgroundColor),
            },
          })}
        >
          {openSidebar ? <MenuOpen /> : <MenuIcon />}
        </IconButton>
        {!(width <= 500 && openSidebar) && (
          <>
            {width > 500 && (isDesktop || !openSidebar) && (
              <Box
                sx={(theme) => ({
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: theme.palette.appBar.color,
                })}
              >
                {applicationName}
              </Box>
            )}
            <FlexGrow />
            <IconButton
              onClick={() => setOpenJoyride(!openJoyride)}
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
            >
              <Tooltip title={t('steps.appBar.tooltip.help')}>
                <HelpOutline />
              </Tooltip>
            </IconButton>
            {openJoyride && <AppBarJoyride run={openJoyride} setRun={setOpenJoyride} />}
            <Hidden xsDown>
              <EditionMenu />
              {width > 500 && (
                <>
                  <DarkModeSwitch />
                  <LanguageMenu />
                </>
              )}
              <ActionMenu width={width} />
            </Hidden>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
