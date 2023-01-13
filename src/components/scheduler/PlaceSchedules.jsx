import React, { useEffect, useState } from 'react';
import ResourceScheduler from './ResourceScheduler';
import BoxW from '../wrapper/BoxW';

const PlaceSchedules = (props) => {
  const { schedules, title: placeName, range, view: schedulerView, setView: setSchedulerView, key, ...otherProps } = props;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const allEvents = [];
    const aux = schedules.map(({ startDateTime, endDateTime, allDay, title, color }) => ({
      start: startDateTime,
      end: endDateTime,
      allDay,
      title,
      color,
    }));
    allEvents.push(...aux);
    setEvents(allEvents);
  }, [schedules]);

  return (
    <BoxW sx={{ width: '20%', left: '-10px', transform: 'rotateX(180deg)' }} key={key}>
      <ResourceScheduler
        {...{
          events,
          setEvents,
          schedulerView,
          setSchedulerView,
        }}
        placeName={placeName}
        validRange={range}
        readOnly
        {...otherProps}
      />
    </BoxW>
  );
};

export default PlaceSchedules;
