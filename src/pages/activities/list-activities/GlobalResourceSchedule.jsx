import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward, FilterList, FilterListOff } from '@mui/icons-material';
import { isSameDay } from 'date-fns';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import BoxW from '../../../components/wrapper/BoxW';
import SchedulerFilter from '../../../components/scheduler/SchedulerFilter';
import PlaceSchedules from '../../../components/scheduler/PlaceSchedules';
import TrackTagList from '../../../components/tags/track/TrackTagList';
import { StyledCard } from '../../../components/context/ThemeChangeContext';
import useTrack from '../../../components/hook/useTrack';
import ActivityService from '../../../services/ActivityService';
import { filterActivity } from '../../../components/scheduler/Scheduler';
import { useToast } from '../../../components/context/toast/ToastContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import { useFlux } from '../../../components/context/FluxContext';
import useLocation from '../../../components/hook/useLocation';

const GlobalResourceSchedule = () => {
  const { handleValidRange } = useTrack();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { formatLocaleDateString } = useLocation();
  const { currentEdition } = useEditionChange();
  const { activitiesUpdateDate, tracksUpdateDate } = useFlux();

  const [anchorEl, setAnchorEl] = useState(null);
  const [placesSchedules, setPlacesSchedules] = useState([]);
  const [schedulerView, setSchedulerView] = useState(undefined);
  const [currentDay, setCurrentDay] = useState(null);
  const [command, setCommand] = useState(null);
  const [filter, setFilter] = useState({});
  const [enableFilter, setEnableFilter] = useState(false);

  const handleFilter = useCallback((filterAux) => {
    setFilter(filterAux);
  }, []);

  useEffect(() => {
    if (currentEdition) {
      ActivityService.findAllByEdition(currentEdition.id).then((response) => {
        if (response.status === 200) {
          const allPlacesSchedules = {};
          response.data.forEach((activity) => {
            const { place, schedule } = activity;
            const aux = { place, schedule };
            if (!filterActivity(activity, filter)) {
              aux.schedule = [];
            }
            const currentPlace = allPlacesSchedules[aux.place.id];
            if (currentPlace) {
              currentPlace.schedule.push(...aux.schedule);
              return;
            }
            allPlacesSchedules[aux.place.id] = aux;
          });
          const allFlat = Object.values(allPlacesSchedules);
          setPlacesSchedules(allFlat);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, activitiesUpdateDate, tracksUpdateDate, filter]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledCard elevation={4}>
        <SchedulerFilter filter={handleFilter} enableFilter={enableFilter}>
          <BoxW p={1} display="flex" width="100%" flexDirection="row">
            <IconButton onClick={() => setCommand('prev')} disabled={isSameDay(handleValidRange.start, currentDay)}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => setCommand('next')} disabled={isSameDay(handleValidRange.end, currentDay)}>
              <ArrowForward />
            </IconButton>
            <IconButton onClick={() => setEnableFilter(!enableFilter)}>{enableFilter ? <FilterListOff /> : <FilterList />}</IconButton>
            <BoxW minWidth="100px" width="100%" display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h4">{formatLocaleDateString(currentDay)}</Typography>
            </BoxW>
          </BoxW>
          <Box p={1} flexDirection="row" display="flex" alignItems="center" height="100%">
            <ScrollContainer
              className="scroll-container"
              vertical={false}
              hideScrollbars={false}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                transform: 'rotateX(180deg)',
              }}
            >
              {_.sortBy(placesSchedules, 'place.name').map((placeSchedules) => (
                <Box id={placeSchedules?.place?.id} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                  <PlaceSchedules
                    key={placeSchedules?.place?.id}
                    command={command}
                    setCommand={setCommand}
                    setCurrentDay={setCurrentDay}
                    title={placeSchedules?.place?.name}
                    schedules={placeSchedules.schedule}
                    range={handleValidRange}
                    view={schedulerView}
                    setView={setSchedulerView}
                    showColumn={anchorEl?.id.toString() === placeSchedules?.place?.id.toString()}
                  />
                </Box>
              ))}
            </ScrollContainer>
          </Box>
          <TrackTagList />
        </SchedulerFilter>
      </StyledCard>
    </>
  );
};

export default GlobalResourceSchedule;
