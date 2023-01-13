import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { Language } from '@mui/icons-material';
import FlagIcon from '../../flag-icon/FlagIcon';
import { getHoverColors } from '../../context/ThemeChangeContext';

const LanguageMenu = (props) => {
  const { buttonMode } = props;

  const [menu, setMenu] = useState(null);
  const { t, i18n } = useTranslation();

  const open = Boolean(menu);

  const languages = useMemo(
    () => [
      { langCode: 'pt-BR', country: 'br' },
      { langCode: 'en-US', country: 'us' },
    ],
    []
  );

  const handleClick = (event) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const [currentLanguage, setCurrentLanguage] = useState(null);

  useEffect(() => {
    const lang = languages.find((language) => language.langCode === i18n.language);
    if (lang) {
      setCurrentLanguage(lang);
    } else {
      setCurrentLanguage(null);
    }
  }, [i18n.language, languages]);

  return (
    <>
      {buttonMode ? (
        <Button
          id="language-button"
          fullWidth
          variant="text"
          onClick={handleClick}
          startIcon={
            (currentLanguage && <FlagIcon height="20px" country={currentLanguage.country} />) || (!currentLanguage && <Language />)
          }
          {...props}
        >
          {t(`enums.languages.${i18n.language}`)}
        </Button>
      ) : (
        <Tooltip title={t('changeLanguage')} placement="top">
          <IconButton
            id="language-button"
            sx={(theme) => ({
              backgroundColor: 'inherit',
              color: theme.palette.getContrastText(theme.palette.appBar.backgroundColor),
              padding: '2px',
              margin: '10px',
              width: '40px',
              height: '40px',
              '&:hover': {
                ...getHoverColors(theme.palette.appBar.backgroundColor),
              },
            })}
            onClick={handleClick}
          >
            {currentLanguage && (
              <FlagIcon
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                country={currentLanguage.country}
              />
            )}
            {!currentLanguage && <LanguageIcon />}
          </IconButton>
        </Tooltip>
      )}
      <Menu
        id="language-menu"
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
        {languages.map((language) => (
          <MenuItem key={language.langCode} onClick={() => changeLanguage(language.langCode)}>
            <FlagIcon country={language.country} />
            <Box component="span" paddingLeft={1}>
              {t(`enums.languages.${language.langCode}`)}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageMenu;
