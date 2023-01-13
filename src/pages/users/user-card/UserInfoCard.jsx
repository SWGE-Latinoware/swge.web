import React, { useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { LocationCity, Mail, Public } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PopoverW from '../../../components/wrapper/PopoverW';
import BoxW from '../../../components/wrapper/BoxW';
import useLocation from '../../../components/hook/useLocation';
import useInstitution from '../../../components/hook/useInstitution';

const PopoverInfo = (props) => {
  const { user, avatarColor } = props;

  const { getCountryName } = useLocation();
  const { renderInstitutionName } = useInstitution();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenEvent = (e) => {
    setAnchorEl(e.target);
  };

  return (
    <>
      <PopoverW
        {...{
          anchorEl,
          setAnchorEl,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <BoxW display="flex" flexWrap="wrap" width="100%" p={1} alignItems="center" maxWidth="500px">
          <Box width="100%" display="flex" p={1} alignItems="center">
            <Box marginRight={2}>
              <Avatar sx={{ bgcolor: avatarColor }} src={user.src}>
                {user.name[0]}
              </Avatar>
            </Box>
            {user.name}
          </Box>
          <Box width="100%" p={1} display="flex" justifyContent="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.speakerInfo.contact')}
            </Typography>
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center">
            <Box marginRight={2}>
              <Mail />
            </Box>
            {user.email}
          </Box>
          <Box width="100%" p={1} display="flex" justifyContent="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.speakerInfo.additionalInformation')}
            </Typography>
          </Box>
          <Box width="100%" display="flex" alignItems="center" p={1}>
            <Box marginRight={2}>
              <Public />
            </Box>
            {getCountryName(user.country)}
          </Box>
          {user.institution && (
            <Box width="100%" display="flex" alignItems="center" p={1}>
              <Box marginRight={2}>
                <LocationCity />
              </Box>
              {renderInstitutionName(user.institution)}
            </Box>
          )}
        </BoxW>
      </PopoverW>
      <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleOpenEvent}>
        {user.name}
      </Typography>
    </>
  );
};

const UserInfoCard = (props) => {
  const { user, avatarColor } = props;

  return (
    <Box display="flex" alignItems="center">
      <Box key={user.name} display="flex" alignItems="center">
        <PopoverInfo user={user} avatarColor={avatarColor} />
      </Box>
    </Box>
  );
};

export default UserInfoCard;
