import React, { createRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Scheduler from './Scheduler';

export const StyledCalendar = styled.th`
  .fc-col-header-cell {
    display: none;
  }

  .fc-timegrid-axis,
  .fc-scrollgrid-shrink,
  .fc-timegrid-slot-label,
  col {
    display: ${(props) => (props.showColumn ? '' : 'none')};
  }

  .fc-timegrid-slot {
    height: 2em;
  }

  .fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 0;
  }
`;

const ResourceScheduler = (props) => {
  const { placeName, command, setCommand, setCurrentDay, showColumn, ...otherProps } = props;

  const calendarRef = createRef();

  useEffect(() => {
    if (calendarRef.current != null && command === 'prev') {
      calendarRef.current.getApi().prev();
    } else if (calendarRef.current != null && command === 'next') {
      calendarRef.current.getApi().next();
    }
    setCommand(null);
  }, [calendarRef, command, setCommand]);

  return (
    <StyledCalendar showColumn={showColumn}>
      <Scheduler
        ref={calendarRef}
        headerToolbar={{
          left: '',
          center: 'title',
          right: '',
        }}
        titleFormat={() => placeName}
        initialView="timeGridDay"
        nowIndicator
        datesSet={(date) => setCurrentDay(date.start)}
        p={0}
        {...otherProps}
      />
    </StyledCalendar>
  );
};

export default ResourceScheduler;
