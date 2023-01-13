import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { max, min } from 'date-fns';
import { useToast } from '../context/toast/ToastContext';
import EditionService from '../../services/EditionService';
import { useEditionChange } from '../context/EditionChangeContext';
import { useFlux } from '../context/FluxContext';

const useTrack = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { tracksUpdateDate } = useFlux();

  const [trackList, setTrackList] = useState([]);

  const getTrackById = useCallback((id) => _.find(trackList, (track) => track.id === id), [trackList]);

  const trackIds = useMemo(() => trackList.map((track) => track.id), [trackList]);

  const getTrackNameById = useCallback(
    (id) => {
      const track = getTrackById(id);
      if (!track) return '';
      return track.name;
    },
    [getTrackById]
  );

  const getTrackByIds = (ids) => ids.map((id) => getTrackById(id));

  useEffect(() => {
    if (currentEdition) {
      EditionService.findAllTracks(currentEdition.id).then((response) => {
        if (response.status === 200) {
          setTrackList(response.data);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, tracksUpdateDate]);

  const handleValidRange = useMemo(() => {
    if (trackList?.length === 0) {
      if (currentEdition) {
        return {
          start: currentEdition.initialDate,
          end: currentEdition.finalDate,
        };
      }
      return undefined;
    }
    return {
      start: min(trackList.map((track) => new Date(track.initialDate))),
      end: max(trackList.map((track) => new Date(track.finalDate))),
    };
  }, [currentEdition, trackList]);

  return {
    getTrackById,
    trackIds,
    getTrackNameById,
    getTrackByIds,
    trackList,
    handleValidRange,
  };
};

export default useTrack;
