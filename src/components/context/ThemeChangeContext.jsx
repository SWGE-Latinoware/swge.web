import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, Card, createTheme, darken, Divider, getLuminance, lighten, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Color } from 'colorinterpreter';
import _ from 'lodash';
import { enUS, ptBR } from '@mui/material/locale';
import i18n from 'i18next';
import ThemeService from '../../services/ThemeService';
import { useToast } from './toast/ToastContext';
import { useEditionChange } from './EditionChangeContext';
import { getThemeUser } from '../../services/Auth';
import { useFlux } from './FluxContext';

const ThemeChangeContext = createContext();

const { getContrastText } = createTheme().palette;

const getHoverColors = (baseColor) => {
  let factor = 0.1 - getLuminance(baseColor);
  let background;
  let color;
  if (factor > 0) {
    background = lighten(baseColor, factor);
    color = getContrastText(lighten(baseColor, factor));
  } else {
    factor = 0.1 - factor / 10;
    background = darken(baseColor, factor);
    color = getContrastText(darken(baseColor, factor));
  }
  return {
    backgroundColor: background,
    color,
  };
};

const innerComposeTheme = (type, palette, language) =>
  createTheme(
    {
      palette: {
        type,
        mode: type,
        primary: {
          main: palette.primary,
          color: getContrastText(palette.primary),
        },
        secondary: {
          main: palette.secondary,
          color: getContrastText(palette.secondary),
        },
        toolbar: {
          backgroundColor: palette.toolbarBackgroundColor,
          color: getContrastText(palette.toolbarBackgroundColor),
        },
        error: {
          main: palette.error,
          color: getContrastText(palette.error),
        },
        warning: {
          main: palette.warning,
          color: getContrastText(palette.warning),
        },
        info: {
          main: palette.info,
          color: getContrastText(palette.info),
        },
        success: {
          main: palette.success,
          color: getContrastText(palette.success),
        },
        titleCard: {
          backgroundColor: palette.titleCardBackgroundColor,
          color: getContrastText(palette.titleCardBackgroundColor),
        },
        appBar: {
          backgroundColor: palette.appBarBackgroundColor,
          color: getContrastText(palette.appBarBackgroundColor),
        },
        sidebar: {
          backgroundColor: palette.sidebarBackgroundColor,
          color: getContrastText(palette.sidebarBackgroundColor),
        },
        background: {
          default: type === 'light' ? '#e8e8e8' : '#303030',
          paper: type === 'light' ? '#f5f5f5' : '#424242',
        },
        divider: palette.sidebarBackgroundColor,
        dividers: {
          drawer: getContrastText(palette.sidebarBackgroundColor),
          card: type === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
        },
      },
      typography: {
        fontFamily: 'Roboto',
        fontSize: 16,
        h1: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 24,
          },
        },
        h2: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 23,
          },
        },
        h3: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 22,
          },
        },
        h4: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 21,
          },
        },
        h5: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 20,
          },
        },
        h6: {
          '@media only screen and (max-width: 900px)': {
            fontSize: 19,
          },
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiAccordionSummary: {
          styleOverrides: {
            expandIconWrapper: {
              '& .MuiSvgIcon-root': {
                color: getContrastText(palette.sidebarBackgroundColor),
              },
            },
          },
        },
        MuiSwitch: {
          variants: [
            {
              props: { variant: 'big' },
              style: {
                width: 58,
                height: 40,
                padding: 0,
                margin: '8px',
                '& .MuiSwitch-switchBase': {
                  padding: 1,
                },
                checked: {},
                '& .MuiSwitch-track': {
                  borderRadius: 19,
                  height: 30,
                  width: 57,
                  marginTop: 4,
                  marginLeft: 1,
                },
                '& .MuiSwitch-thumb': {
                  width: 36,
                  height: 36,
                },
              },
            },
          ],
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            contained: {
              boxShadow: '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              color: `${getContrastText(type === 'light' ? '#f5f5f5' : '#424242')} !important`,
              backgroundColor: type === 'light' ? '#f5f5f5' : '#424242',
            },
            textColorPrimary: {
              color: getContrastText(type === 'light' ? '#f5f5f5' : '#424242'),
              '&$selected': {
                color: getContrastText(type === 'light' ? '#f5f5f5' : '#424242'),
              },
            },
            textColorSecondary: {
              color: getContrastText(type === 'light' ? '#f5f5f5' : '#424242'),
              '&$selected': {
                color: getContrastText(type === 'light' ? '#f5f5f5' : '#424242'),
              },
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            flexContainer: {
              backgroundColor: type === 'light' ? '#f5f5f5' : '#424242',
            },
            indicator: {
              backgroundColor: palette.primary,
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            filterPaper: {
              minWidth: '450px',
            },
            icon: {
              '&:hover': {
                color: 'inherit',
              },
            },
          },
        },
        MUIDataTableFilter: {
          styleOverrides: {
            resetLink: {
              color: 'inherit',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            hover: {
              '&:hover': {
                backgroundColor: `${type === 'light' ? '#EBEBEB' : '#515151'} !important`,
              },
            },
          },
        },
        MUIRichTextEditor: {
          styleOverrides: {
            root: {
              border: `1px solid ${type === 'light' ? '#BCBCBC' : 'rgb(118, 118, 118)'}`,
              borderRadius: 12,
              '&:hover': {
                border: `1px solid ${type === 'light' ? '#202020' : '#fff'}`,
              },
            },
            editor: {
              padding: 10,
              minHeight: '20vh',
              overflow: 'auto',
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            data: {
              fontSize: 20,
            },
            fixedHeader: {
              fontSize: 20,
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              '@media only screen and (max-width: 900px)': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
            },
          },
        },
        MuiStepper: {
          styleOverrides: {
            root: {
              backgroundColor: 'inherit',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'unset',
            },
            elevation1: {
              boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)',
            },
            elevation2: {
              boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)',
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            gutterBottom: {
              marginBottom: 8,
            },
          },
        },
      },
      zIndex: {
        appBar: 500,
        drawer: 600,
      },
    },
    language
  );

const getColorStandardPalette = (palette) => _.mapValues(palette, (color) => new Color(color).toHEX());

const composeTheme = (type, palette, language) => {
  const standardPalette = getColorStandardPalette(palette);
  return innerComposeTheme(type, standardPalette, language);
};

const getBasePalette = (light) => ({
  primary: {
    color: light ? '#2a3a4f' : '#4f6d94',
  },
  secondary: {
    color: light ? '#292d31' : '#292d31',
  },
  error: {
    color: light ? '#f44336' : '#f44336',
  },
  warning: {
    color: light ? '#ff9800' : '#ff9800',
  },
  info: {
    color: light ? '#2196f3' : '#2196f3',
  },
  success: {
    color: light ? '#4caf50' : '#4caf50',
  },
  toolbarBackgroundColor: {
    color: light ? '#292d31' : '#292d31',
  },
  titleCardBackgroundColor: {
    color: light ? '#4b4f52' : '#4b4f52',
  },
  appBarBackgroundColor: {
    color: light ? '#191C20' : '#191C20',
  },
  sidebarBackgroundColor: {
    color: light ? '#191C20' : '#191C20',
  },
});

const getPaletteCustom = (light, field) => {
  const basePalette = getBasePalette(light);
  const palette = {};
  Object.keys(basePalette).forEach((k) => {
    palette[k] = basePalette[k][field];
  });
  return palette;
};

const getPaletteJSON = (light) => getPaletteCustom(light === undefined ? true : light, 'color');

const composeDefaultTheme = (type, language) => {
  const palette = getPaletteJSON(type === 'light');
  return composeTheme(type, palette, language);
};

export const StyledCard = styled(Card)(({ theme, p }) => ({
  padding: theme.spacing(p == null ? 2 : p),
  width: '100%',
}));

export const DividerInCard = styled(Divider)(({ theme }) => ({
  opacity: 0.3,
  backgroundColor: theme.palette.dividers.card,
}));

export const TypographyURL = styled(Typography)(({ theme, urlType, urlNoDecorator }) => ({
  fontSize: '16px',
  textDecorationLine: urlNoDecorator ? 'none' : 'underline',
  cursor: 'pointer',
  color: theme.palette.text[urlType || 'primary'],
}));

export const FlexGrow = styled(Box)({
  flexGrow: 1,
});

const ThemeChangeProvider = ({ setCurrentTheme, defaultLight, defaultDark, currentTheme, children }) => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition, setUpdateEdition } = useEditionChange();
  const { themesUpdateDate } = useFlux();

  const [prefersDarkMode, setPrefersDarkMode] = useState(getThemeUser());
  const [lightTheme, setLightTheme] = useState({});
  const [darkTheme, setDarkTheme] = useState({});
  const [editionLightTheme, setEditionLightTheme] = useState(null);
  const [editionDarkTheme, setEditionDarkTheme] = useState(null);
  const [previewChanges, setPreviewChanges] = useState(false);
  const [allThemes, setAllThemes] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const elements = document.getElementById('main');
    elements.style.setProperty('--border-right', getContrastText(currentTheme.palette.info.main));
    elements.style.setProperty('--background', currentTheme.palette.info.main);
    elements.style.setProperty('--border', currentTheme.palette.info.main);
  }, [currentTheme]);

  useEffect(() => {
    setAllThemes([]);
  }, [themesUpdateDate]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(document.documentElement.scrollHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const rollbackDefaultTheme = () => {
    if (prefersDarkMode) {
      if (editionDarkTheme) {
        setCurrentTheme(editionDarkTheme);
        return;
      }
      setCurrentTheme(defaultDark);
      return;
    }
    if (editionLightTheme) {
      setCurrentTheme(editionLightTheme);
      return;
    }
    setCurrentTheme(defaultLight);
  };

  useEffect(() => {
    setCurrentTheme(prefersDarkMode ? darkTheme : lightTheme);
  }, [darkTheme, lightTheme, prefersDarkMode, setCurrentTheme]);

  useEffect(() => {
    if (allThemes.length === 0) {
      ThemeService.findAllList().then((response) => {
        if (response.status === 200) {
          setAllThemes(response.data);
          setUpdateEdition(true);
        } else {
          addToast({ body: t('toastes.errorGetData'), type: 'error' });
        }
      });
    }
  }, [addToast, allThemes.length, setUpdateEdition, t]);

  useEffect(() => {
    if (currentEdition) {
      const language = i18n.language === 'pt-BR' ? ptBR : enUS;
      if (currentEdition.defaultDarkTheme) {
        const dark = composeTheme('dark', currentEdition.defaultDarkTheme.colorPalette, language);
        setEditionDarkTheme(dark);
        if (prefersDarkMode) setCurrentTheme(dark);
      } else {
        setEditionDarkTheme(null);
        if (prefersDarkMode) setCurrentTheme(defaultDark);
      }
      if (currentEdition.defaultLightTheme) {
        const light = composeTheme('light', currentEdition.defaultLightTheme.colorPalette, language);
        setEditionLightTheme(light);
        if (!prefersDarkMode) setCurrentTheme(light);
      } else {
        setEditionLightTheme(null);
        if (!prefersDarkMode) setCurrentTheme(defaultLight);
      }
    }
  }, [currentEdition, defaultDark, defaultLight, prefersDarkMode, setCurrentTheme]);

  return (
    <ThemeChangeContext.Provider
      value={{
        prefersDarkMode,
        setPrefersDarkMode,
        setLightTheme,
        setDarkTheme,
        getPaletteJSON,
        composeTheme,
        defaultLight,
        defaultDark,
        rollbackDefaultTheme,
        composeDefaultTheme,
        previewChanges,
        setPreviewChanges,
        allThemes,
        setAllThemes,
        currentTheme,
        setEditionDarkTheme,
        setEditionLightTheme,
        width,
        height,
      }}
    >
      {children}
    </ThemeChangeContext.Provider>
  );
};

const useThemeChange = () => {
  const context = useContext(ThemeChangeContext);

  if (!context) {
    throw new Error('useThemeChange must be used within a ThemeChangeProvider');
  }

  return context;
};

export { ThemeChangeProvider, useThemeChange, composeDefaultTheme, getHoverColors };
