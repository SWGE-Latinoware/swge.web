import React from 'react';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useHistory } from 'react-router-dom';
import { StyledCard, TypographyURL, useThemeChange } from '../../../components/context/ThemeChangeContext';
import Toolbar from '../../../components/toolbar/Toolbar';
import BoxW from '../../../components/wrapper/BoxW';
import { useUserChange } from '../../../components/context/UserChangeContext';
import useLocation from '../../../components/hook/useLocation';
import ButtonW from '../../../components/wrapper/ButtonW';

const UserProfile = () => {
  const { t } = useTranslation();
  const { currentUser, userImage } = useUserChange();
  const { getCountryName, getStateName, formatLocaleDateString } = useLocation();
  const history = useHistory();
  const { currentTheme } = useThemeChange();

  const getFirstLetters = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('');

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.myAccount')]} hasArrowBack />
      <Box p={2} flexDirection="column" display="flex" flexWrap="wrap" width="100%">
        <StyledCard p={0} elevation={4} sx={{ maxWidth: '1600px', paddingBottom: '50px' }}>
          <BoxW flexDirection="row" display="flex" flexWrap="wrap" width="100%" justifyContent="center">
            <BoxW p={7} width="15%">
              <Avatar sx={{ width: 150, height: 150, border: '2px solid', borderColor: currentTheme.getContrastText }} src={userImage}>
                <Typography variant="h3" color="inherit" align="center">
                  {getFirstLetters(currentUser.name)}
                </Typography>
              </Avatar>
            </BoxW>
            <BoxW flexDirection="column" display="flex" flexWrap="wrap" width="35%" p={2}>
              {currentUser.exclusion && (
                <Typography
                  sx={(theme) => ({ color: currentUser.exclusion.isApproved ? theme.palette.error.main : theme.palette.warning.main })}
                  paddingTop={5}
                  variant="body1"
                  fontWeight="bold"
                  pb={1}
                >
                  {`${t(
                    `layouts.actionMenu.${currentUser.exclusion.isApproved ? 'exclusionDeadlineDate' : 'reviewDate'}`
                  )}: ${formatLocaleDateString(currentUser.exclusion.date)}`}
                </Typography>
              )}
              <Typography paddingTop={currentUser.exclusion ? 0 : 5} variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.name}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.email}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                ID: {currentUser?.id}
              </Typography>
              <Typography paddingTop={5} variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.birthDate')}</p>:
                {currentUser?.birthDate && formatLocaleDateString(currentUser?.birthDate)}
              </Typography>
              <Typography variant="body2" fontWeight="bold" pb={1}>
                {getCountryName(currentUser?.country)}
              </Typography>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                <Typography variant="body2" pr={3} fontWeight="bold" pb={1}>
                  {getStateName(currentUser?.state)}
                </Typography>
                <Typography variant="body2" fontWeight="bold" pb={1}>
                  {currentUser?.city}
                </Typography>
              </BoxW>
              <Typography variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.zipCode')}</p>: {currentUser?.zipCode}
              </Typography>
              <Typography variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.addressUnique')}</p>: {currentUser?.addressLine1}
              </Typography>
              <Typography variant="body2" fontWeight="bold" pb={1}>
                {currentUser?.institution?.name}
              </Typography>
              <Typography variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.mobilePhone')}</p>: {currentUser?.cellPhone}
              </Typography>
              <Typography variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.phone')}</p>: {currentUser?.phone}
              </Typography>
              <Typography variant="body2" pb={1}>
                <p style={{ display: 'inline', fontWeight: 'bold' }}>{t('pages.myAccount.gender')}</p>:{' '}
                {currentUser?.gender && t(`enums.genders.${currentUser?.gender}`)}
              </Typography>
              <Typography variant="body2" fontWeight="bold" pb={1}>
                {t('pages.myAccount.specialNeedsText')}
              </Typography>
              <BoxW flexDirection="column" display="flex" flexWrap="wrap">
                {currentUser?.needsTypes.map((need) => (
                  <BoxW p={0.5}>
                    <Chip key={need} label={t(`enums.specialNeeds.${need}`)} />
                  </BoxW>
                ))}
              </BoxW>
            </BoxW>
            <BoxW flexDirection="column" display="flex" flexWrap="wrap" width="40%" p={2}>
              <Typography paddingTop={5} variant="body1" fontWeight="bold" pb={1}>
                {t('pages.myAccount.biography')}
              </Typography>
              <BoxW>
                <Typography variant="body2" pb={1}>
                  {currentUser?.bibliography?.blocks[0].text}
                </Typography>
              </BoxW>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap" paddingTop={5}>
                <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                  {t('pages.myAccount.github')}
                </Typography>
                <TypographyURL variant="body2" pb={1}>
                  {currentUser?.github}
                </TypographyURL>
              </BoxW>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                  {t('pages.myAccount.orcid')}
                </Typography>
                <TypographyURL variant="body2" pb={1}>
                  {currentUser?.orcid}
                </TypographyURL>
              </BoxW>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                  {t('pages.myAccount.linkedin')}
                </Typography>
                <TypographyURL variant="body2" pb={1}>
                  {currentUser?.linkedin}
                </TypographyURL>
              </BoxW>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                  {t('pages.myAccount.website')}
                </Typography>
                <TypographyURL variant="body2" pb={1}>
                  {currentUser?.website}
                </TypographyURL>
              </BoxW>
              <BoxW flexDirection="row" display="flex" flexWrap="wrap">
                <Typography variant="body2" pr={1} fontWeight="bold" pb={1}>
                  {t('pages.myAccount.lattes')}
                </Typography>
                <TypographyURL variant="body2" pb={1}>
                  {currentUser?.lattes}
                </TypographyURL>
              </BoxW>
              <Typography paddingTop={5} variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.admin ? t('pages.myAccount.admin') : ''}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.enabled ? t('pages.myAccount.enabled') : t('pages.myAccount.notEnabled')}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.confirmed ? t('pages.myAccount.confirmed') : t('pages.myAccount.notConfirmed')}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.emailCommunication ? t('pages.myAccount.communication') : ''}
              </Typography>
              <Typography variant="body1" fontWeight="bold" pb={1}>
                {currentUser?.socialCommunication ? t('pages.myAccount.socialCommunication') : ''}
              </Typography>
              <BoxW pt={5}>
                <ButtonW variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => history.push('/cli/edit-account')}>
                  <Typography variant="body2">{t('pages.myAccount.editProfile')}</Typography>
                </ButtonW>
              </BoxW>
            </BoxW>
          </BoxW>
        </StyledCard>
      </Box>
    </>
  );
};

export default UserProfile;
