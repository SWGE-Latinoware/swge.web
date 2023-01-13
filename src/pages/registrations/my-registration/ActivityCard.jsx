import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarGroup, Box, Card, CardActions, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import * as Colors from '@mui/material/colors';
import _, { round } from 'lodash';
import { CalendarToday, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useRTE from '../../../components/hook/useRTE';
import useLocation from '../../../components/hook/useLocation';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import FlagIcon from '../../../components/flag-icon/FlagIcon';
import SpeakerInfoCard from './SpeakerInfoCard';
import FileService from '../../../services/FileService';
import BoxW from '../../../components/wrapper/BoxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import Scheduler from '../../../components/scheduler/Scheduler';
import TrackInfoCard from './TrackInfoCard';

export const SimpleContentDisplay = (props) => {
  const { leftItem, rightItem, width = '100%', textColor, isIcon } = props;

  return (
    <Box alignItems="center" display="flex" flexWrap="wrap" flexDirection="row" width={width} sx={{ color: textColor }}>
      {leftItem && !isIcon ? (
        <Box paddingRight={1}>
          <Typography fontWeight="bold">{`${leftItem}:`}</Typography>
        </Box>
      ) : (
        <Box paddingRight={1}>
          <Typography fontWeight="bold">{leftItem}</Typography>
        </Box>
      )}
      <Box>{rightItem}</Box>
    </Box>
  );
};

export const useClientRect = () => {
  const [rect, setRect] = useState(null);

  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);

  return [rect, ref];
};

const ActivityCard = (props) => {
  const { key, activity, onCheck, readOnly, onCardHeightChange, idealCardHeight, conflicts } = props;

  const [events, setEvents] = useState([]);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const { renderFromState } = useRTE();
  const { formatCurrency } = useLocation();
  const { t } = useTranslation();

  const [rect, ref] = useClientRect();

  const [expanded, setExpanded] = useState(false);

  const avatarColor = useMemo(() => _.sample(Colors)[500], []);

  const [speakerSrc, setSpeakerSrc] = useState({});

  useEffect(() => {
    if (onCardHeightChange && rect && !expanded) {
      onCardHeightChange(rect.height);
    }
  }, [expanded, onCardHeightChange, rect]);

  useEffect(() => {
    activity.speakers.forEach(({ speaker }) => {
      if (speaker.userProfile && speaker.src == null) {
        FileService.findOne(speaker.userProfile.id).then((response) => {
          if (response.status === 200) {
            // eslint-disable-next-line no-param-reassign
            speaker.src = URL.createObjectURL(
              new Blob([response.data], { type: `image${speaker.userProfile.format === 'svg' ? '/svg+xml' : ''};charset=utf-8` })
            );
            speakerSrc[speaker.id] = speaker.src;
            setSpeakerSrc(_.clone(speakerSrc));
          }
        });
      }
    });
  }, [activity, speakerSrc]);

  useEffect(() => {
    if (activity.schedule.length > 0) {
      setEvents(
        activity.schedule.map(({ startDateTime, endDateTime, allDay, title, color }) => ({
          start: startDateTime,
          end: endDateTime,
          allDay,
          title,
          color,
        }))
      );
    }
  }, [activity.schedule]);

  return (
    <>
      <CustomDialog
        dialogProps={{ maxWidth: 'lg' }}
        open={openScheduleDialog}
        onClose={() => setOpenScheduleDialog(false)}
        title={t('pages.myRegistration.scheduleTitle')}
        content={
          <BoxW width="100%">
            <Scheduler
              {...{
                events,
                setEvents,
              }}
              readOnly
              validRange={{
                start: activity?.track?.initialDate,
                end: activity?.track?.finalDate,
              }}
            />
          </BoxW>
        }
      />
      <Box
        p={1}
        key={key}
        sx={(theme) => ({
          height: expanded || !idealCardHeight ? 'auto' : `${round(idealCardHeight)}px`,
          width: '30%',
          '@media screen and (max-width:900px)': { width: '100%' },
          transition: theme.transitions.create(['width', 'height'], {
            duration: theme.transitions.duration.complex,
          }),
        })}
      >
        <Box sx={(theme) => ({ backgroundColor: theme.palette.error.main, borderRadius: 1.3, textAlign: 'center' })}>
          {conflicts?.find((acti) => acti.activity1.id === activity.id) && t('pages.myRegistration.activityCard.conflict')}
          <Card
            ref={ref}
            elevation={4}
            sx={(theme) => ({
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: theme.spacing(2),
            })}
          >
            <CardHeader
              avatar={
                <AvatarGroup max={2} variant="circular">
                  {activity.speakers.map(({ speaker }) => (
                    <Avatar key={speaker.id} sx={{ bgcolor: avatarColor }} src={speakerSrc[speaker.id]}>
                      {speaker.name[0]}
                    </Avatar>
                  ))}
                </AvatarGroup>
              }
              action={!readOnly && <CheckboxW onChange={(e) => onCheck && onCheck(activity, e.target.checked)} primary />}
              title={activity.name}
              subheader={formatCurrency(activity.price)}
            />
            <CardContent sx={{ height: '250px' }}>{renderFromState(activity.description)}</CardContent>
            <CardContent>
              {expanded && (
                <Box width="100%" display="flex" flexWrap="wrap" flexDirection="column">
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.track')}
                    rightItem={<TrackInfoCard track={activity.track} />}
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.responsible')}
                    rightItem={
                      activity.responsibleUser ? (
                        <SpeakerInfoCard speakers={[activity.responsibleUser]} avatarColor={avatarColor} />
                      ) : (
                        <Typography sx={(theme) => ({ color: theme.palette.error.main })}>
                          {t('pages.myRegistration.activityCard.noResponsible')}
                        </Typography>
                      )
                    }
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.speakers')}
                    rightItem={<SpeakerInfoCard speakers={activity.speakers} avatarColor={avatarColor} />}
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.vacancies')}
                    rightItem={`${activity.remainingVacancies}/${activity.vacancies}`}
                  />
                  <SimpleContentDisplay leftItem={t('pages.myRegistration.activityCard.workload')} rightItem={activity.workload} />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.type')}
                    rightItem={t(`enums.activityTypes.${activity.type}`)}
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.presentationType')}
                    rightItem={t(`enums.editionTypes.${activity.presentationType}`)}
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.language')}
                    rightItem={
                      <Box display="flex" alignItems="center">
                        {activity.language}
                        {activity.languageFlag && (
                          <Box paddingLeft={1}>
                            <FlagIcon country={activity.languageFlag} height="25px" />
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <SimpleContentDisplay
                    leftItem={t('pages.myRegistration.activityCard.price')}
                    rightItem={formatCurrency(activity.price)}
                  />
                </Box>
              )}
            </CardContent>
            <CardActions disableSpacing sx={{ marginLeft: 'auto' }}>
              <Tooltip title={t('pages.myRegistration.tooltip.calendar')}>
                <IconButton onClick={() => setOpenScheduleDialog(true)}>
                  <CalendarToday />
                </IconButton>
              </Tooltip>
              <IconButton
                sx={(theme) => ({
                  transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  marginLeft: 'auto',
                  transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.complex,
                  }),
                })}
                onClick={() => setExpanded(!expanded)}
              >
                <ExpandMore />
              </IconButton>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default ActivityCard;
