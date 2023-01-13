import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';

import { Box } from '@mui/material';
import Topbar from '../topbar/Topbar';
import Sidebar from '../sidebar/Sidebar';

const Template = (props) => {
  const { children, applicationName, template } = props;

  const isDesktop = !isMobile;

  const [openSidebar, setOpenSidebar] = useState(isDesktop);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <Box
      sx={(theme) => ({
        paddingTop: '56px',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
          paddingTop: '84px',
        },
        marginLeft: openSidebar ? '280px' : '0px',
      })}
    >
      <Topbar
        isDesktop={isDesktop}
        openSidebar={openSidebar}
        toggleSidebar={toggleSidebar}
        applicationName={applicationName}
      />
      <Sidebar
        onClose={toggleSidebar}
        open={openSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        template={template}
        onClick={(e) => {
          if (!isDesktop) {
            if (e.target.tagName === 'SPAN') {
              toggleSidebar();
            }
          }
        }}
      />
      <Box component="main" height="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Template;
