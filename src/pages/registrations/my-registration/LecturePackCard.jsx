import React, { useEffect, useState } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { round } from 'lodash';
import { CalendarToday, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useRTE from '../../../components/hook/useRTE';
import useLocation from '../../../components/hook/useLocation';
import CheckboxW from '../../../components/wrapper/CheckboxW';
import { SimpleContentDisplay, useClientRect } from './ActivityCard';
import BoxW from '../../../components/wrapper/BoxW';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import Scheduler from '../../../components/scheduler/Scheduler';

const LecturePackCard = (props) => {
  const { key, activities, activity, onCardHeightChange, idealCardHeight, conflicts } = props;

  const { renderFromState } = useRTE();
  const { formatCurrency } = useLocation();
  const { t } = useTranslation();

  const [rect, ref] = useClientRect();

  const [expanded, setExpanded] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [events, setEvents] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    if (onCardHeightChange && rect && !expanded) {
      onCardHeightChange(rect.height);
    }
  }, [expanded, onCardHeightChange, rect]);

  useEffect(() => {
    if (conflicts.length > 0) setExpanded(true);
    else setExpanded(false);
  }, [conflicts.length]);

  const handleActivitySelected = (activ) => {
    setOpenScheduleDialog(true);
    setSelectedActivity(activ);

    setEvents(
      activ.schedule.map(({ startDateTime, endDateTime, allDay, title, color }) => ({
        start: startDateTime,
        end: endDateTime,
        allDay,
        title,
        color,
      }))
    );
  };

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
                start: selectedActivity?.track?.initialDate,
                end: selectedActivity?.track?.finalDate,
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
          <CardHeader action={<CheckboxW checked disabled primary />} title={activity.name} subheader={formatCurrency(activity.price)} />
          <CardContent sx={{ height: '250px' }}>{renderFromState(activity.description)}</CardContent>
          <CardContent>
            {expanded && (
              <>
                <Box width="100%" p={1} display="flex" justifyContent="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t('pages.myRegistration.lecturePackCard.activityList')}
                  </Typography>
                </Box>
                <Box width="100%" display="flex" flexWrap="wrap" flexDirection="row">
                  {activities.map((activityAux) => (
                    <BoxW display="flex" width="100%" alignItems="center">
                      {conflicts?.find((acti) => acti.activity2.id === activityAux.id) ? (
                        <SimpleContentDisplay
                          rightItem={<Typography sx={(theme) => ({ color: theme.palette.error.main })}>{activityAux.name}</Typography>}
                        />
                      ) : (
                        <SimpleContentDisplay rightItem={activityAux.name} />
                      )}
                      <Tooltip title={t('pages.myRegistration.tooltip.calendar')}>
                        <IconButton onClick={() => handleActivitySelected(activityAux)}>
                          <CalendarToday />
                        </IconButton>
                      </Tooltip>
                    </BoxW>
                  ))}
                </Box>
              </>
            )}
          </CardContent>
          <CardActions disableSpacing sx={{ marginTop: 'auto' }}>
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
    </>
  );
};

export default LecturePackCard;
