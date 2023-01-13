import React, { useState } from 'react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { AccountBox, GitHub, LinkedIn, LocationCity, Mail, Public, Web } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PopoverW from '../../../components/wrapper/PopoverW';
import BoxW from '../../../components/wrapper/BoxW';
import useLocation from '../../../components/hook/useLocation';
import useRTE from '../../../components/hook/useRTE';
import IconSvg from '../../../components/icon-svg-styles/IconSvg';
import { ReactComponent as OrcidIcon } from '../../../assets/image/orcid-brands.svg';
import useInstitution from '../../../components/hook/useInstitution';

const ContactIcon = (props) => {
  const { Icon, property, speaker, title, isSvgIcon } = props;

  const handleLinkOpen = (url) => {
    window.open(url, '_blank');
  };

  return speaker[property] ? (
    <Box marginRight={2}>
      <Tooltip title={title}>
        {!isSvgIcon ? (
          <Icon sx={{ cursor: 'pointer' }} onClick={() => handleLinkOpen(speaker[property])} />
        ) : (
          <Box>
            <IconSvg component={Icon} sx={{ cursor: 'pointer' }} onClick={() => handleLinkOpen(speaker[property])} />
          </Box>
        )}
      </Tooltip>
    </Box>
  ) : (
    <></>
  );
};

const PopoverInfo = (props) => {
  const { speaker, speakers, idx, avatarColor } = props;

  const { getCountryName } = useLocation();
  const { renderFromState } = useRTE();
  const { renderInstitutionName } = useInstitution();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenEvent = (e) => {
    setAnchorEl(e.target);
  };

  const hasContactInfo = () =>
    speaker.github != null || speaker.linkedin != null || speaker.lattes != null || speaker.order != null || speaker.website != null;

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
              <Avatar sx={{ bgcolor: avatarColor }} src={speaker.src}>
                {speaker.name[0]}
              </Avatar>
            </Box>
            {speaker.name}
          </Box>
          {speaker.bibliography && (
            <>
              <Box width="100%" p={1} display="flex" justifyContent="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('pages.myRegistration.activityCard.speakerInfo.biography')}
                </Typography>
              </Box>
              <Box width="100%" p={1}>
                {renderFromState(speaker.bibliography)}
              </Box>
            </>
          )}
          {hasContactInfo() && speaker.socialCommunication && (
            <>
              <Box width="100%" p={1} display="flex" justifyContent="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('pages.myRegistration.activityCard.speakerInfo.contact')}
                </Typography>
              </Box>
              <Box width="100%" display="flex" p={1} alignItems="center">
                <Box marginRight={2}>
                  <Mail />
                </Box>
                {speaker.email}
              </Box>
              <Box width="100%" display="flex" p={1}>
                <ContactIcon Icon={GitHub} speaker={speaker} property="github" title="GitHub" />
                <ContactIcon Icon={LinkedIn} speaker={speaker} property="linkedin" title="LinkedIn" />
                <ContactIcon Icon={AccountBox} speaker={speaker} property="lattes" title="Lattes" />
                <ContactIcon Icon={OrcidIcon} speaker={speaker} property="orcid" title="Orcid" isSvgIcon />
                <ContactIcon Icon={Web} speaker={speaker} property="website" title="Website" />
              </Box>
            </>
          )}
          <Box width="100%" p={1} display="flex" justifyContent="center">
            <Typography variant="subtitle1" fontWeight="bold">
              {t('pages.myRegistration.activityCard.speakerInfo.additionalInformation')}
            </Typography>
          </Box>
          <Box width="100%" display="flex" alignItems="center" p={1}>
            <Box marginRight={2}>
              <Public />
            </Box>
            {getCountryName(speaker.country)}
          </Box>
          {speaker.institution && (
            <Box width="100%" display="flex" alignItems="center" p={1}>
              <Box marginRight={2}>
                <LocationCity />
              </Box>
              {renderInstitutionName(speaker.institution)}
            </Box>
          )}
        </BoxW>
      </PopoverW>
      <Typography sx={{ cursor: 'pointer' }} onClick={handleOpenEvent}>
        {speaker.name}
      </Typography>
      {idx < speakers.length - 1 && <Box paddingRight={1}>,</Box>}
    </>
  );
};

const SpeakerInfoCard = (props) => {
  const { speakers, avatarColor } = props;

  return (
    <Box display="flex" alignItems="center">
      {speakers.map((item, idx) => {
        const speaker = item.speaker ? item.speaker : item;
        return (
          <Box key={speaker.name} display="flex" alignItems="center">
            <PopoverInfo speaker={speaker} speakers={speakers} idx={idx} avatarColor={avatarColor} />
          </Box>
        );
      })}
    </Box>
  );
};

export default SpeakerInfoCard;
