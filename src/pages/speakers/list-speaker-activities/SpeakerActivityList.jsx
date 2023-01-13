import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import Toolbar from '../../../components/toolbar/Toolbar';
import Scheduler, { filterActivities } from '../../../components/scheduler/Scheduler';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import useTrack from '../../../components/hook/useTrack';
import EditionService from '../../../services/EditionService';
import { useToast } from '../../../components/context/toast/ToastContext';
import { useFlux } from '../../../components/context/FluxContext';
import { useUserChange } from '../../../components/context/UserChangeContext';
import BoxW from '../../../components/wrapper/BoxW';
import SpeakerActivityDialog from './SpeakerActivityDialog';

const SpeakerActivityList = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { handleValidRange } = useTrack();
  const { currentUser } = useUserChange();
  const { activitiesUpdateDate, trackUpdateDate } = useFlux();

  const [events, setEvents] = useState([]);
  const [schedulerView, setSchedulerView] = useState(undefined);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [activityInfo, setActivityInfo] = useState(null);
  const [filter, setFilter] = useState({});

  const handleFilter = useCallback((filterAux) => {
    setFilter(filterAux);
  }, []);

  useEffect(() => {
    if (currentEdition && currentUser) {
      EditionService.findAllActivitiesBySpeaker(currentEdition.id, currentUser.id).then((response) => {
        if (response.status === 200) {
          const allEvents = [];
          const realActivities = filterActivities(response.data, filter);
          realActivities.forEach((activity) => {
            const { schedule } = activity;
            const aux = schedule.map(({ startDateTime, endDateTime, allDay, title, color }) => ({
              start: startDateTime,
              end: endDateTime,
              allDay,
              title,
              color,
              activity,
            }));
            allEvents.push(...aux);
          });
          setEvents(allEvents);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, activitiesUpdateDate, trackUpdateDate, currentUser, filter]);

  const handleClick = (event) => {
    // eslint-disable-next-line no-underscore-dangle
    setActivityInfo(event._def.extendedProps.activity);
    setOpenActivityDialog(true);
  };

  return (
    <>
      <Toolbar title={[t('layouts.sidebar.activities'), t('layouts.sidebar.speakerActivities')]} hasArrowBack />
      {openActivityDialog && (
        <SpeakerActivityDialog openDialog={openActivityDialog} setOpenDialog={setOpenActivityDialog} formData={activityInfo} />
      )}
      <BoxW p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
        <StyledCard elevation={4} sx={{ maxWidth: '1500px' }}>
          <Box flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" width="100%" height="100%">
            <Box width="100%" height="100%">
              <Scheduler
                {...{
                  events,
                  setEvents,
                  schedulerView,
                  setSchedulerView,
                }}
                onEventClick={handleClick}
                validRange={handleValidRange}
                readOnly
                filter={handleFilter}
                eventContent={(arg) => (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: arg.view.type === 'dayGridMonth' && 'center',
                    }}
                  >
                    <Box width="100%" whiteSpace="pre-wrap" flexWrap="wrap" display="flex">{`${arg.event.title}`}</Box>
                    <Box
                      width="100%"
                      whiteSpace="pre-wrap"
                      flexWrap="wrap"
                      display="flex"
                    >{`${arg.event.extendedProps.activity.place.name} - ${arg.event.extendedProps.activity.place.number}`}</Box>
                  </div>
                )}
              />
            </Box>
          </Box>
        </StyledCard>
      </BoxW>
    </>
  );
};

export default SpeakerActivityList;
