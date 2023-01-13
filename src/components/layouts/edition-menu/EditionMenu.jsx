import React, { useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TodayIcon from '@mui/icons-material/Today';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEditionChange } from '../../context/EditionChangeContext';
import { getHoverColors, useThemeChange } from '../../context/ThemeChangeContext';

const LanguageMenu = () => {
  const { editionList, setCurrentEdition, currentEdition } = useEditionChange();
  const history = useHistory();
  const { currentTheme } = useThemeChange();
  const { t } = useTranslation();

  const [menu, setMenu] = useState(null);

  const classes = {
    iconButtonEdition: {
      color: currentTheme.palette.getContrastText(currentTheme.palette.appBar.backgroundColor),
      padding: '2px',
      margin: '10px',
      width: '40px',
      height: '40px',
      '&:hover': {
        ...getHoverColors(currentTheme.palette.appBar.backgroundColor),
      },
    },
  };

  const open = Boolean(menu);

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  const changeEdition = (edition) => {
    setCurrentEdition(edition);
    history.replace(`/${edition.year}/home`);
    handleClose();
  };

  return (
    <>
      <IconButton id="edition-button" sx={classes.iconButtonEdition} onClick={handleClick}>
        <Tooltip title={t('steps.appBar.tooltip.edition')}>
          {(currentEdition && <Typography variant="button">{currentEdition.year}</Typography>) || <TodayIcon />}
        </Tooltip>
      </IconButton>
      <Menu
        id="edition-menu"
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
        {_.sortBy(_.filter(editionList, 'enabled'), 'year')
          .reverse()
          .map((edition) => (
            <MenuItem key={edition.id} onClick={() => changeEdition(edition)}>
              {edition.year}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default LanguageMenu;
