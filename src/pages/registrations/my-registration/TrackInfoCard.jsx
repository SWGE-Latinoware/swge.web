import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PopoverW from '../../../components/wrapper/PopoverW';
import BoxW from '../../../components/wrapper/BoxW';
import useRTE from '../../../components/hook/useRTE';
import useLocation from '../../../components/hook/useLocation';

const PopoverInfo = (props) => {
  const { track } = props;

  const { renderFromState } = useRTE();
  const { t } = useTranslation();
  const { formatLocaleDateString } = useLocation();

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
          <Box width="100%" display="flex" p={1} justifyContent="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.track')}
            </Typography>
          </Box>
          <Box width="100%" p={1} display="flex" flexWrap="wrap" justifyContent="center">
            {track.name}
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center" justifyContent="space-around">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.trackInfo.initialDate')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.trackInfo.finalDate')}
            </Typography>
          </Box>
          <Box width="100%" display="flex" p={1} alignItems="center" justifyContent="space-around">
            <Box p={1}>{formatLocaleDateString(track.initialDate)}</Box>
            <Box p={1}>{formatLocaleDateString(track.finalDate)}</Box>
          </Box>
          <>
            <Box width="100%" display="flex" justifyContent="center">
              <Typography variant="subtitle1" fontWeight="bold">
                {t('pages.myRegistration.activityCard.trackInfo.description')}
              </Typography>
            </Box>
            <Box width="100%" p={1}>
              {renderFromState(track.description)}
            </Box>
          </>
        </BoxW>
      </PopoverW>
      <Typography sx={{ cursor: 'pointer' }} onClick={handleOpenEvent}>
        {track.name}
      </Typography>
    </>
  );
};

const TrackInfoCard = (props) => {
  const { track } = props;

  return (
    <Box display="flex" alignItems="center">
      <Box key={track.name} display="flex" alignItems="center">
        <PopoverInfo track={track} />
      </Box>
    </Box>
  );
};

export default TrackInfoCard;
