/* eslint-disable no-param-reassign,no-underscore-dangle */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import _ from 'lodash';
import { Edit, EditOff, Save, Star, StarBorder } from '@mui/icons-material';
import StarPlusIcon from 'mdi-react/StarPlusIcon';
import StarMinusIcon from 'mdi-react/StarMinusIcon';
import Toolbar from '../../../components/toolbar/Toolbar';
import Scheduler, { filterActivity } from '../../../components/scheduler/Scheduler';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import useTrack from '../../../components/hook/useTrack';
import { useToast } from '../../../components/context/toast/ToastContext';
import { useFlux } from '../../../components/context/FluxContext';
import { useUserChange } from '../../../components/context/UserChangeContext';
import BoxW from '../../../components/wrapper/BoxW';
import RegistrationService from '../../../services/RegistrationService';
import FabW from '../../../components/wrapper/FabW';
import PopoverW from '../../../components/wrapper/PopoverW';
import useLocation from '../../../components/hook/useLocation';
import FavoriteActionGif from '../../../assets/image/favorite-schedule-action.gif';
import FavoriteAllActionGif from '../../../assets/image/favorite-all-action.gif';
import { JoyrideContentWithGif } from '../../../components/joyride/AppBarJoyride';

export const mapSchedule = (schedule, activity, isSelected) => ({
  start: schedule.startDateTime,
  end: schedule.endDateTime,
  allDay: schedule.allDay,
  title: schedule.title,
  color: schedule.color,
  extendedProps: {
    schedule,
    activity,
    selected: isSelected,
  },
});

const UserActivities = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { handleValidRange } = useTrack();
  const { currentUser } = useUserChange();
  const { activitiesUpdateDate, trackUpdateDate } = useFlux();
  const { formatLocaleTimeString } = useLocation();

  const [events, setEvents] = useState([]);
  const [schedulerView, setSchedulerView] = useState(undefined);
  const [userEdit, setUserEdit] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [removeEvent, setRemoveEvent] = useState(undefined);
  const [filter, setFilter] = useState({});

  const calendarEvents = useMemo(() => events.filter((event) => filterActivity(event.extendedProps.activity, filter)), [events, filter]);

  const helperContent = [
    {
      title: t('pages.userActivities.helper.editActivities.title'),
      content: t('pages.userActivities.helper.editActivities.content'),
      target: '.fc-customButtonToolbar-button',
    },
    {
      title: t('pages.userActivities.helper.favorite.title'),
      content: (
        <JoyrideContentWithGif
          content={t('pages.userActivities.helper.favorite.content')}
          gif={FavoriteActionGif}
          height="180px"
          width="280px"
        />
      ),
      target: '.fc-daygrid-day.fc-day.fc-day-thu.fc-day-past',
      placement: 'top',
    },
    {
      title: t('pages.userActivities.helper.favoriteAll.title'),
      content: (
        <JoyrideContentWithGif
          content={t('pages.userActivities.helper.favoriteAll.content')}
          gif={FavoriteAllActionGif}
          height="170px"
          width="300px"
        />
      ),
      target: '.fc-daygrid-day.fc-day.fc-day-thu.fc-day-past',
      placement: 'top',
    },
    {
      title: t('pages.userActivities.helper.fab.title'),
      content: t('pages.userActivities.helper.fab.content'),
      target: '#save-fab',
      placement: 'left',
    },
  ];

  useEffect(() => {
    if (currentEdition && currentUser) {
      RegistrationService.findOneByEditionAndUser(currentEdition.id, currentUser.id).then((response) => {
        if (response.status === 200) {
          const { individualRegistrations } = response.data;
          setUserRegistration(response.data);

          const allRegisteredEvents = [];
          const allSelectedEvents = [];

          individualRegistrations.forEach((indvReg) => {
            const { activity, individualRegistrationScheduleList } = indvReg;
            const schedule = individualRegistrationScheduleList.map((sche) => sche.schedule);
            const allRegisteredEvent = activity.schedule;

            const selectedEvent = schedule.map((sche) => mapSchedule(sche, activity, true));

            const eventRegistered = allRegisteredEvent.map((sche) => mapSchedule(sche, activity, false));

            allRegisteredEvents.push(...eventRegistered);
            allSelectedEvents.push(...selectedEvent);
          });

          allSelectedEvents.forEach((selEvent) => {
            allRegisteredEvents.forEach((regEvent) => {
              if (selEvent.extendedProps.schedule.id === regEvent.extendedProps.schedule.id) {
                regEvent.selected = true;
              }
            });
          });

          setSelectedEvents(_.uniqBy(allSelectedEvents, (value) => `${value.extendedProps.schedule.id}`));
          setAllEvents(_.uniqBy(allRegisteredEvents, (value) => `${value.extendedProps.schedule.id}`));

          setEvents(_.uniqBy(allSelectedEvents, (value) => `${value.extendedProps.schedule.id}`));
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, activitiesUpdateDate, trackUpdateDate, currentUser]);

  const handleSave = () => {
    if (selectedEvents.length > 0) {
      const schedulesList = [];
      selectedEvents.forEach((selectedEvent) => {
        schedulesList.push(selectedEvent.extendedProps.schedule.id);
      });
      RegistrationService.updateUserScheduleList(userRegistration.id, schedulesList).then((resp) => {
        if (resp.status === 200) {
          addToast({ body: t('toastes.save'), type: 'success' });
          return;
        }
        addToast({ body: t('toastes.saveError'), type: 'error' });
      });
    }
  };

  const removeSchedule = useCallback(
    (eventInfo) => {
      if (eventInfo != null) {
        setRemoveEvent(undefined);
        setAnchorEl(null);
        const registeredEvents = allEvents;
        const userEvents = selectedEvents;

        registeredEvents.forEach((remEvent) => {
          if (remEvent.extendedProps.schedule.id === eventInfo.extendedProps.schedule.id) {
            remEvent.selected = false;
          }
        });
        _.remove(selectedEvents, (e) => e.extendedProps.schedule.id === eventInfo.extendedProps.schedule.id);

        setSelectedEvents(_.uniqBy(userEvents, (value) => `${value.extendedProps.schedule.id}`));
        setAllEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
        setEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
      }
    },
    [allEvents, selectedEvents]
  );

  const addSchedule = useCallback(
    (eventInfo) => {
      if (eventInfo != null) {
        setRemoveEvent(undefined);
        setAnchorEl(null);
        const registeredEvents = allEvents;
        const userEvents = selectedEvents;

        registeredEvents.forEach((remEvent) => {
          if (remEvent.extendedProps.schedule.id === eventInfo.extendedProps.schedule.id) {
            remEvent.selected = true;
          }
        });
        userEvents.push(mapSchedule(eventInfo.extendedProps.schedule, eventInfo.extendedProps.activity, true));

        setSelectedEvents(_.uniqBy(userEvents, (value) => `${value.extendedProps.schedule.id}`));
        setAllEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
        setEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
      }
    },
    [allEvents, selectedEvents]
  );

  const handleEventClick = (clickInfo) => {
    setRemoveEvent(clickInfo.event);
    setAnchorEl(clickInfo.el);
  };

  const handleEditClicked = useCallback(() => {
    if (!userEdit) {
      setEvents(allEvents);
      setUserEdit(true);
    } else {
      setEvents(selectedEvents);
      setUserEdit(false);
    }
  }, [allEvents, selectedEvents, userEdit]);

  const handleActivity = useCallback(() => {
    setRemoveEvent(undefined);
    setAnchorEl(null);

    const registeredEvents = allEvents;
    const userEvents = selectedEvents;

    registeredEvents.forEach((event) => {
      if (event.extendedProps.activity.id === removeEvent.extendedProps.activity.id) {
        if (removeEvent.extendedProps.selected) {
          event.selected = false;
          _.remove(selectedEvents, (e) => e.extendedProps.schedule.id === event.extendedProps.schedule.id);
        } else {
          event.selected = true;
          userEvents.push(mapSchedule(event.extendedProps.schedule, removeEvent.extendedProps.activity, true));
        }
      }
    });

    setSelectedEvents(_.uniqBy(userEvents, (value) => `${value.extendedProps.schedule.id}`));
    setAllEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
    setEvents(_.uniqBy(registeredEvents, (value) => `${value.extendedProps.schedule.id}`));
  }, [allEvents, removeEvent, selectedEvents]);

  const handleFilter = useCallback((filterAux) => {
    setFilter(filterAux);
  }, []);

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.activities'), t('layouts.sidebar.userActivities')]} hasArrowBack helperContent={helperContent} />
      <PopoverW
        {...{
          anchorEl,
          setAnchorEl,
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Box display="flex" width="100%" p={1}>
          <Box>
            <Tooltip
              title={removeEvent?.extendedProps.selected ? t('pages.userActivities.removeActivity') : t('pages.userActivities.addActivity')}
            >
              <IconButton onClick={handleActivity}>{removeEvent?.extendedProps.selected ? <StarMinusIcon /> : <StarPlusIcon />}</IconButton>
            </Tooltip>
          </Box>
        </Box>
      </PopoverW>
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard p={0} elevation={4}>
          <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" width="100%" height="100%">
            <Box width="100%" height="100%">
              <Scheduler
                {...{
                  schedulerView,
                  setSchedulerView,
                }}
                customButton={handleEditClicked}
                selectable={false}
                filter={handleFilter}
                events={calendarEvents}
                setEvents={() => {}}
                readOnly
                customButtonText={
                  userEdit ? (
                    <EditOff sx={{ '@media screen and (max-width:900px)': { fontSize: '1em' } }} />
                  ) : (
                    <Edit sx={{ '@media screen and (max-width:900px)': { fontSize: '1em' } }} />
                  )
                }
                customButtonHint={userEdit ? t('pages.userActivities.userSchedule') : t('pages.userActivities.editUserSchedule')}
                validRange={handleValidRange}
                eventDisplay="block"
                eventClick={(event) => {
                  handleEventClick(event);
                }}
                eventContent={(arg) => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: arg.view.type === 'dayGridMonth' && 'center',
                    }}
                  >
                    <Typography fontWeight="bold" fontSize="inherit" paddingRight={2}>
                      {arg.event.allDay ? '' : formatLocaleTimeString(arg.event.startStr)}
                    </Typography>
                    <Box whiteSpace="pre-wrap" flexWrap="wrap" display="flex">{`${arg.event.title}`}</Box>
                    {userEdit && (
                      <Tooltip
                        title={
                          arg.event.extendedProps.selected
                            ? t('pages.userActivities.removeSchedule')
                            : t('pages.userActivities.addSchedule')
                        }
                      >
                        <IconButton
                          sx={{
                            marginLeft: 'auto',
                            paddingTop: arg.view.type !== 'dayGridMonth' && !arg.event.allDay ? '0px' : '8px',
                          }}
                          onClick={() => (arg.event.extendedProps.selected ? removeSchedule(arg.event._def) : addSchedule(arg.event._def))}
                        >
                          {arg.event.extendedProps.selected ? (
                            <Star
                              sx={(theme) => ({
                                color: theme.palette.getContrastText(
                                  arg.backgroundColor === 'null' || arg.backgroundColor == null ? '#2196F3' : arg.backgroundColor
                                ),
                              })}
                            />
                          ) : (
                            <StarBorder
                              sx={(theme) => ({
                                color: theme.palette.getContrastText(
                                  arg.backgroundColor === 'null' || arg.backgroundColor == null ? '#2196F3' : arg.backgroundColor
                                ),
                              })}
                            />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                )}
              />
            </Box>
          </Box>
        </StyledCard>
      </BoxW>
      <FabW id="save-fab" onClick={handleSave}>
        <Save />
      </FabW>
    </>
  );
};

export default UserActivities;
