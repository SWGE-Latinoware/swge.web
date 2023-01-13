import React, { useState } from 'react';
import ArrowBackIcons from '@mui/icons-material/ArrowBack';
import { Box, Breadcrumbs, IconButton, Toolbar as MuiToolbar, Tooltip, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { HelpOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getHoverColors, useThemeChange } from '../context/ThemeChangeContext';
import JoyrideW from '../joyride/JoyrideW';
import HelmetW from '../wrapper/HelmetW';

const Toolbar = (props) => {
  const history = useHistory();
  const { width } = useThemeChange();
  const { t } = useTranslation();

  const routeBack = () => {
    history.goBack();
  };

  const [helperRun, setHelperRun] = useState(false);

  const { title, hasArrowBack, helperContent, ...otherProps } = props;

  return (
    <>
      <HelmetW title={title} />
      {width > 800 ? (
        <MuiToolbar
          sx={(theme) => ({
            position: 'relative',
            marginTop: '42px',
            backgroundColor: theme.palette.toolbar.backgroundColor,
            color: theme.palette.toolbar.color,
            fontSize: 20,
            maxHeight: '55px',
            zIndex: theme.zIndex.appBar,
          })}
        >
          {hasArrowBack && (
            <IconButton
              sx={(theme) => ({
                backgroundColor: theme.palette.toolbar.backgroundColor,
                color: theme.palette.getContrastText(theme.palette.toolbar.backgroundColor),
                '&:hover': {
                  ...getHoverColors(theme.palette.toolbar.backgroundColor),
                },
              })}
              variant="contained"
              onClick={routeBack}
            >
              <ArrowBackIcons />
            </IconButton>
          )}
          {(typeof title === 'string' && <Typography fontSize={20}>{title}</Typography>) || (
            <Breadcrumbs
              sx={(theme) => ({
                color: theme.palette.toolbar.color,
              })}
              separator={<NavigateNextIcon fontSize="small" />}
            >
              {title.map((text) =>
                typeof text === 'string' || !text.url ? (
                  <Typography fontSize={20}>{typeof text === 'string' ? text : text.title}</Typography>
                ) : (
                  <Typography
                    fontSize={20}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      '&:hover': {
                        ...getHoverColors(theme.palette.toolbar.backgroundColor),
                      },
                    })}
                    key={text.title}
                    onClick={() => history.push(text.url)}
                  >
                    {text.title}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          )}
          {helperContent && (
            <>
              <IconButton
                onClick={() => setHelperRun(!helperRun)}
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
              {helperRun && <JoyrideW steps={helperContent} run={helperRun} setRun={setHelperRun} scrollToFirstStep {...otherProps} />}
            </>
          )}
        </MuiToolbar>
      ) : (
        <Box p={2} />
      )}
    </>
  );
};

export default Toolbar;
