import React from 'react';
import { Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import _ from 'lodash';
import { useGlobalLoading } from '../context/GlobalLoadingContext';
import NotAllowed from '../../pages/errors/not-allowed/NotAllowed';
import { useThemeChange } from '../context/ThemeChangeContext';

export const Roles = {
  LOGGED_IN: 'LOGGED_IN',
  ADMINISTRATOR: 'ADMINISTRATOR',
  CARAVAN_COORDINATOR: 'CARAVAN_COORDINATOR',
  COMPLETED: 'COMPLETED',
  SPEAKER: 'SPEAKER',
  SECRETARY: 'SECRETARY',
  DPO: 'DPO',
};

const RouterLoading = (props) => {
  const { children } = props;

  const { isLoading, isBlocking } = useGlobalLoading();
  const { width, height } = useThemeChange();

  return (
    <>
      {isBlocking && (
        <Box
          component="div"
          zIndex={isBlocking && 80000}
          top={0}
          left={0}
          position="absolute"
          display="flex"
          width={width}
          height={height}
          alignItems="center"
          justifyContent="center"
        />
      )}
      {isLoading && (
        <Box zIndex={isBlocking && 80001} top="30%" left="50%" position="absolute">
          <CircularProgress size={90} />
        </Box>
      )}
      {children}
    </>
  );
};

const RouteWithSecurity = (props) => {
  const {
    layout: Layout,
    component: Component,
    roles,
    isAllowed,
    setAllowed,
    handlePermission,
    disableCompletedMandatory = false,
    mandatoryRoles,
    ...otherProps
  } = props;

  const { isBreaking } = useGlobalLoading();

  const finalMandatoryRoles = mandatoryRoles ? _.clone(mandatoryRoles) : [];

  if (!disableCompletedMandatory) {
    if (!finalMandatoryRoles.includes(Roles.COMPLETED)) {
      finalMandatoryRoles.push(Roles.COMPLETED);
    }
  }

  handlePermission(roles, finalMandatoryRoles);

  return isAllowed === true || isAllowed === undefined ? (
    <>
      {!isBreaking && (
        <Route
          render={(matchProps) => (
            <RouterLoading>
              <Layout>
                <Component {...matchProps} />
              </Layout>
            </RouterLoading>
          )}
          {...otherProps}
        />
      )}
    </>
  ) : (
    <NotAllowed />
  );
};

export default RouteWithSecurity;
