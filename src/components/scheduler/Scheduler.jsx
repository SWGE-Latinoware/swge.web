import React, { forwardRef, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useTranslation } from 'react-i18next';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box, Card, IconButton } from '@mui/material';
import { Delete, FilterList, FilterListOff } from '@mui/icons-material';
import _ from 'lodash';
import { useEditionChange } from '../context/EditionChangeContext';
import PopoverW from '../wrapper/PopoverW';
import ObjectUtils from '../../utils/ObjectUtils';
import SchedulerFilter from './SchedulerFilter';

export const filterActivity = (activity, filter) => {
  if (!filter || _.isEmpty(filter) || (!filter.place && !filter.track && !filter.speaker && !filter.responsible)) return true;
  let enabled = true;

  if (filter.place) {
    enabled = activity?.place?.id === filter.place;
  }
  if (filter.track) {
    if (activity?.track?.id !== filter.track) {
      enabled = false;
    }
  }
  if (filter.speaker) {
    if (!activity?.speakers?.some(({ speaker }) => speaker.id === filter.speaker)) {
      enabled = false;
    }
  }
  if (filter.responsible) {
    enabled = activity?.responsibleUser?.id === filter.responsible;
  }
  return enabled;
};

export const filterActivities = (activities, filter) => {
  if (!activities) return activities;
  return activities.filter((activity) => filterActivity(activity, filter));
};

const Scheduler = forwardRef((props, ref) => {
  const {
    newEventName,
    newEventBackgroundColor,
    events,
    setEvents,
    readOnly,
    schedulerView,
    setSchedulerView,
    onEventClick,
    customButton,
    customButtonText,
    customButtonHint,
    filter,
    p = 1,
    ...otherProps
  } = props;

  const { i18n, t } = useTranslation();
  const { currentEdition } = useEditionChange();

  const [anchorEl, setAnchorEl] = useState(null);
  const [removeEvent, setRemoveEvent] = useState(undefined);
  const [enableFilter, setEnableFilter] = useState(false);
  const hashedEvents = useMemo(() => ObjectUtils.getHash(events), [events]);

  const handleDateSelect = (selectInfo) => {
    const { calendar } = selectInfo.view;
    calendar.unselect();
    calendar.addEvent({
      title: newEventName || '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      color: newEventBackgroundColor,
    });
  };

  const handleEventClick = (clickInfo) => {
    if (onEventClick) {
      onEventClick(clickInfo.event);
      return;
    }
    setRemoveEvent(clickInfo.event);
    setAnchorEl(clickInfo.el);
  };

  const handleEventRemove = () => {
    removeEvent.remove();
    setRemoveEvent(undefined);
    setAnchorEl(null);
  };

  const handleEventsChange = (eventsChange) => {
    const mappedEvents = eventsChange.map(({ title, startStr, endStr, allDay, backgroundColor, extendedProps }) => ({
      title,
      start: startStr,
      end: endStr,
      allDay,
      color: backgroundColor,
      extendedProps,
    }));

    if (ObjectUtils.getHash(mappedEvents) === hashedEvents) return;

    setEvents(mappedEvents);
    eventsChange.forEach(({ source }) => {
      const currentView = source?.context?.currentViewType;
      if (currentView && currentView !== schedulerView && setSchedulerView) {
        setSchedulerView(currentView);
      }
    });
  };

  return (
    <>
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
            <IconButton onClick={handleEventRemove}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </PopoverW>
      <SchedulerFilter filter={filter} enableFilter={enableFilter}>
        <Card sx={{ p }}>
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            customButtons={{
              customButtonToolbar: {
                text: customButtonText,
                hint: customButtonHint,
                click: () => {
                  customButton();
                },
              },
              filterButtonToolbar: {
                text: enableFilter ? (
                  <FilterListOff sx={{ '@media screen and (max-width:900px)': { fontSize: '1em' } }} />
                ) : (
                  <FilterList sx={{ '@media screen and (max-width:900px)': { fontSize: '1em' } }} />
                ),
                hint: i18n.language === 'pt-BR' ? 'Filtro' : 'Filter',
                click() {
                  setEnableFilter(!enableFilter);
                },
              },
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: customButton
                ? `${filter ? 'filterButtonToolbar ' : ''}customButtonToolbar dayGridMonth,timeGridWeek,timeGridDay`
                : `${filter ? 'filterButtonToolbar ' : ''}dayGridMonth,timeGridWeek,timeGridDay`,
            }}
            initialEvents={!readOnly && events}
            contentHeight="auto"
            initialView={schedulerView || 'dayGridMonth'}
            locale={i18n.language}
            buttonText={t('calendar.buttonText', { returnObjects: true })}
            buttonHints={t('calendar.buttonHints', { returnObjects: true })}
            dayMaxEvents={3}
            moreLinkText={t('calendar.buttonText.moreLinkText')}
            moreLinkHint={t('calendar.buttonHints.moreLinkHint')}
            editable={!readOnly}
            selectable={!readOnly}
            selectMirror
            allDayText={t('calendar.allDay')}
            moreLinkClick="day"
            events={readOnly && events}
            select={handleDateSelect}
            eventClick={(!readOnly || onEventClick) && handleEventClick}
            validRange={{
              start: currentEdition?.initialDate,
              end: currentEdition?.finalDate,
            }}
            eventsSet={handleEventsChange}
            {...otherProps}
          />
        </Card>
      </SchedulerFilter>
    </>
  );
});

export default Scheduler;
