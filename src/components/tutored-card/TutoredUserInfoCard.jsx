import React, { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { PermContactCalendar, Public } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CellphoneIcon from 'mdi-react/CellphoneIcon';
import CardAccountDetailsIcon from 'mdi-react/CardAccountDetailsIcon';
import useLocation from '../hook/useLocation';
import PopoverW from '../wrapper/PopoverW';
import BoxW from '../wrapper/BoxW';

const PopoverInfo = (props) => {
  const { tutoredUser } = props;

  const { getCountryName, formatLocaleDateString } = useLocation();
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
          <Box width="100%" display="flex" p={1} alignItems="center" justifyContent="center">
            {tutoredUser.name} [{tutoredUser.tagName}]
          </Box>
          <Box width="100%" p={1} display="flex" justifyContent="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('tutoredUserCard.info')}
            </Typography>
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center">
            <Box marginRight={2}>
              <PermContactCalendar />
            </Box>
            {formatLocaleDateString(tutoredUser.birthDate)}
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center">
            <Box marginRight={2}>
              <CellphoneIcon />
            </Box>
            {tutoredUser.cellPhone}
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center">
            <Box marginRight={2}>
              <CardAccountDetailsIcon />
            </Box>
            {tutoredUser.idNumber}
          </Box>
          <Box width="100%" display="flex" alignItems="center" p={1}>
            <Box marginRight={2}>
              <Public />
            </Box>
            {getCountryName(tutoredUser.country)}
          </Box>
          {tutoredUser?.needsTypes.length > 0 && (
            <Typography variant="body2" fontWeight="bold" pb={1}>
              {t('tutoredUserCard.specialNeedsText')}
            </Typography>
          )}
          <BoxW flexDirection="column" display="flex" flexWrap="wrap">
            {tutoredUser?.needsTypes.map((need) => (
              <BoxW p={0.5}>
                <Chip key={need} label={t(`enums.specialNeeds.${need}`)} />
              </BoxW>
            ))}
          </BoxW>
        </BoxW>
      </PopoverW>
      <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleOpenEvent}>
        {tutoredUser.name}
      </Typography>
    </>
  );
};

const TutoredUserInfoCard = (props) => {
  const { tutoredUser } = props;

  return (
    <Box display="flex" alignItems="center">
      <Box key={tutoredUser.name} display="flex" alignItems="center">
        <PopoverInfo tutoredUser={tutoredUser} />
      </Box>
    </Box>
  );
};

export default TutoredUserInfoCard;
