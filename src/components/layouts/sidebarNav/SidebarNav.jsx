import React, { forwardRef, useEffect, useState } from 'react';
import { NavLink as RouterLink, useHistory } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, lighten, List, ListItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import _ from 'lodash';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import { useEditionChange } from '../../context/EditionChangeContext';
import { FlexGrow, useThemeChange } from '../../context/ThemeChangeContext';
import InfoService from '../../../services/InfoService';
import DefaultLogo from '../../icon-svg-styles/DefaultLogo';

export const AppVersions = () => {
  const [apiVersion, setApiVersion] = useState(null);

  const webVersion = process.env.REACT_APP_VERSION;

  useEffect(() => {
    InfoService.getVersion().then((response) => {
      if (response.status === 200) {
        setApiVersion(response.data);
        return;
      }
      setApiVersion(null);
    });
  }, []);

  return (
    <Box height="fit-content" width="100%" display="flex" justifyContent="space-around" marginTop="30px" marginBottom="30px">
      {apiVersion && <Typography fontSize={14}>{`API: v${apiVersion}`}</Typography>}
      {webVersion && <Typography fontSize={14}>{`WEB: v${webVersion}`}</Typography>}
    </Box>
  );
};

const isRouterActive = (otherRefs, path) =>
  otherRefs.some((otherRef) => {
    let newPath = path;
    if (path.match(/^\/\d+(\/.*)?/) != null) {
      newPath = `/${_.slice(path.split('/'), 2).join('/')}`;
    }
    if (otherRef === newPath) return true;
    const pathItems = newPath.split('/');
    const refItems = otherRef.split('/');
    if (pathItems.length !== refItems.length) return false;
    for (let i = 0; i < refItems.length; i += 1) {
      if (!refItems[i].startsWith(':') && refItems[i] !== pathItems[i]) return false;
    }
    return true;
  });

const CustomRouterLink = forwardRef(({ otherRefs, ...otherProps }, ref) => (
  <FlexGrow ref={ref}>
    {(otherRefs && <RouterLink isActive={(match, location) => isRouterActive(otherRefs, location.pathname)} {...otherProps} />) || (
      <RouterLink {...otherProps} />
    )}
  </FlexGrow>
));

const SidebarNav = (props) => {
  const { pages, onClick } = props;
  const history = useHistory();
  const { currentLogo, currentEdition } = useEditionChange();
  const { currentTheme } = useThemeChange();

  const classes = {
    active: {
      color: currentTheme.palette.getContrastText(lighten(currentTheme.palette.sidebar.backgroundColor, 0.1)),
      backgroundColor: lighten(currentTheme.palette.sidebar.backgroundColor, 0.1),
      borderRadius: 12,
      borderRight: `5px solid ${currentTheme.palette.primary.main}`,
    },
  };

  const getOtherRefs = (otherRefs, href) => {
    let newPath = href;
    if (href.match(/^\/\d+(\/.*)?/) != null) {
      newPath = `/${_.slice(href.split('/'), 2).join('/')}`;
    }
    if (otherRefs && newPath) {
      otherRefs.push(newPath);
      return otherRefs;
    }
    if (otherRefs) {
      return otherRefs;
    }
    if (newPath) {
      return [newPath];
    }
    return [];
  };

  return (
    <Box
      sx={{
        overflow: 'auto',
        maxHeight: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::-moz-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Box width="100%" marginTop="30px" marginBottom="10px">
        <Box onClick={() => history.push('/home')} sx={{ cursor: 'pointer' }} display="flex" justifyContent="center">
          <Box component="svg" maxWidth="190px" height="auto">
            {currentEdition?.logo === null ? <DefaultLogo /> : <image href={currentLogo} width="100%" height="100%" />}
          </Box>
        </Box>
      </Box>
      <List
        sx={(theme) => ({
          padding: theme.spacing(1),
          paddingTop: '40px',
          width: '100%',
          paddingLeft: '20px',
        })}
        onClick={onClick}
      >
        {pages.map((page, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            {page.title && (
              <>
                <ListItem
                  sx={{
                    display: 'flex',
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  disableGutters
                  key={page.title}
                >
                  <Button
                    startIcon={page.icon || <FiberManualRecordOutlinedIcon />}
                    activeStyle={classes.active}
                    sx={(theme) => ({
                      color: theme.palette.sidebar.color,
                      backgroundColor: theme.palette.sidebar.backgroundColor,
                      padding: theme.spacing(2),
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      letterSpacing: 0,
                      width: '100%',
                    })}
                    otherRefs={getOtherRefs(page.otherRefs, page.href)}
                    component={CustomRouterLink}
                    to={page.href}
                  >
                    {page.title}
                  </Button>
                </ListItem>
              </>
            )}
            {page.accordionName && (
              <Box>
                <Accordion
                  sx={(theme) => ({
                    backgroundColor: theme.palette.sidebar.backgroundColor,
                    color: theme.palette.sidebar.color,
                  })}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      component="span"
                      className="MuiButton-startIcon MuiButton-iconSizeMedium"
                      sx={{
                        display: 'inherit',
                        marginRight: '8px',
                        marginLeft: '-4px',
                        '> svg': {
                          maxWidth: '20px',
                          maxHeight: '20px',
                        },
                      }}
                    >
                      {page.icon || <FiberManualRecordOutlinedIcon />}
                    </Box>
                    {page.accordionName}
                  </AccordionSummary>
                  {/* eslint-disable-next-line no-shadow */}
                  {page.accordion.map((accordion, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <AccordionDetails>
                        <Button
                          startIcon={accordion.icon || <FiberManualRecordOutlinedIcon />}
                          activeStyle={classes.active}
                          sx={(theme) => ({
                            marginLeft: '15px',
                            color: theme.palette.sidebar.color,
                            backgroundColor: theme.palette.sidebar.backgroundColor,
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            letterSpacing: 0,
                            width: '100%',
                          })}
                          otherRefs={getOtherRefs(accordion.otherRefs, accordion.href)}
                          component={CustomRouterLink}
                          to={accordion.href}
                        >
                          {accordion.title}
                        </Button>
                      </AccordionDetails>
                    </div>
                  ))}
                </Accordion>
              </Box>
            )}
          </div>
        ))}
      </List>
      <AppVersions />
    </Box>
  );
};

export default SidebarNav;
