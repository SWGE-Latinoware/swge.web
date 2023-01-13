import { useTranslation } from 'react-i18next';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import _ from 'lodash';
import { useToast } from '../context/toast/ToastContext';
import EditionService from '../../services/EditionService';
import { useEditionChange } from '../context/EditionChangeContext';
import { useFlux } from '../context/FluxContext';

const useSpeaker = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { usersUpdateDate } = useFlux();

  const [speakerList, setSpeakerList] = useState([]);

  const getSpeakerById = useCallback((id) => _.find(speakerList, (speaker) => speaker.id === id), [speakerList]);

  const speakerIds = useMemo(() => speakerList.map((speaker) => speaker.id), [speakerList]);

  const getSpeakerNameById = useCallback((id) => {
    const speaker = getSpeakerById(id);
    if (!speaker) return '';
    return speaker.name;
  }, [getSpeakerById]);

  const getSpeakerByIds = (ids) => ids.map((id) => getSpeakerById(id));

  useEffect(() => {
    if (currentEdition) {
      EditionService.findAllSpeakers(currentEdition.id).then((response) => {
        if (response.status === 200) {
          setSpeakerList(response.data);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, usersUpdateDate]);

  return {
    getSpeakerById,
    speakerIds,
    getSpeakerNameById,
    getSpeakerByIds,
  };
};

export default useSpeaker;
