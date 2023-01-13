import React, { useState } from 'react';
import { Avatar, IconButton, styled, Typography } from '@mui/material';
import IconExpandMore from '@mui/icons-material/ExpandMore';
import { useHistory } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import { useUserChange } from '../../context/UserChangeContext';
import { getHoverColors } from '../../context/ThemeChangeContext';
import languageMenu from '../language-menu/LanguageMenu';
import DarkModeSwitch from '../../dark-mode-switch/DarkModeSwitch';
import UserUtils from '../../../utils/UserUtils';
import useLocation from '../../hook/useLocation';

const buttonStyle = (theme) => ({
  color: 'inherit',
  '&:hover': {
    ...getHoverColors(theme.palette.background.paper),
  },
  display: 'flex',
  justifyContent: 'flex-start',
});

const MenuButton = styled(Button)(({ theme }) => buttonStyle(theme));
const DarkModeSwitchButtonMenuButton = styled(DarkModeSwitch)(({ theme }) => buttonStyle(theme));
const LanguageMenuButtonMenuButton = styled(languageMenu)(({ theme }) => buttonStyle(theme));

const ActionMenu = (props) => {
  const { width } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const { currentUser, handleLogout, userImage } = useUserChange();
  const { formatLocaleDateString } = useLocation();
  const [menu, setMenu] = useState(null);

  const onClickUserLogout = () => {
    handleLogout();
    history.push('/login');
  };

  const handleMyAccount = () => {
    history.push('/cli/my-account');
  };

  const open = Boolean(menu);

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  const handleName = () => {
    if (currentUser) {
      if (UserUtils.isFakeTempName(currentUser.name)) {
        return (
          <Typography
            sx={(theme) => ({
              color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
            })}
          >
            ***
          </Typography>
        );
      }
      const names = currentUser.name.split(' ');
      if (names.length > 1) {
        return (
          <Typography
            sx={(theme) => ({
              color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
            })}
          >{`${names.at(0)} ${names.at(-1)}`}</Typography>
        );
      }
      return (
        <Typography
          sx={(theme) => ({
            color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
          })}
        >{`${names.at(0)}`}</Typography>
      );
    }
    return '';
  };

  const handleExclusionDate = () => {
    if (currentUser && currentUser.exclusion) {
      return (
        <Typography
          sx={(theme) => ({
            color: currentUser.exclusion.isApproved ? theme.palette.error.main : theme.palette.warning.main,
            fontSize: 12,
          })}
          align="center"
        >
          {`${t(
            `layouts.actionMenu.${currentUser.exclusion.isApproved ? 'exclusionDeadlineDate' : 'reviewDate'}`
          )}: ${formatLocaleDateString(currentUser.exclusion.date)}`}
        </Typography>
      );
    }
    return '';
  };

  return (
    <>
      <IconButton
        sx={(theme) => ({
          padding: '2px',
          margin: '10px',
          '&:hover': {
            ...getHoverColors(theme.palette.appBar.backgroundColor),
          },
        })}
      >
        <Avatar
          alt="avatar"
          src={userImage}
          sx={(theme) => ({
            backgroundColor: 'inherit',
            color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
          })}
        />
      </IconButton>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>{width > 500 && handleName()}</div>
        <div>{width > 500 && handleExclusionDate()}</div>
      </div>
      <IconButton
        id="user-menu"
        sx={(theme) => ({
          backgroundColor: 'inherit',
          color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
          '&:hover': {
            ...getHoverColors(theme.palette.appBar.backgroundColor),
          },
        })}
        onClick={handleClick}
      >
        <IconExpandMore />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={menu}
        keepMounted
        disableAutoFocusItem
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            marginTop: '0px',
          },
        }}
      >
        <Box width="100%" p={1}>
          <MenuButton fullWidth startIcon={<PersonIcon />} variant="text" onClick={handleMyAccount}>
            <Box>{t('layouts.actionMenu.myAccount')}</Box>
          </MenuButton>
        </Box>
        {width <= 500 && (
          <>
            <Box width="100%" p={1}>
              <DarkModeSwitchButtonMenuButton buttonMode />
            </Box>
            <Box width="100%" p={1}>
              <LanguageMenuButtonMenuButton buttonMode />
            </Box>
          </>
        )}
        <Box width="100%" p={1}>
          <MenuButton
            fullWidth
            startIcon={<PowerSettingsNewIcon />}
            variant="text"
            onClick={() => {
              handleClose();
              onClickUserLogout();
            }}
          >
            <Box>{t('layouts.actionMenu.logOut')}</Box>
          </MenuButton>
        </Box>
      </Menu>
    </>
  );
};

export default ActionMenu;
