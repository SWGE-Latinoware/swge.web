import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import EditionService from '../../services/EditionService';
import useBaseHistory from '../hook/useBaseHistory';
import FileService from '../../services/FileService';
import swgeLogo from '../../assets/image/grupo_128.svg';
import { useFlux } from './FluxContext';
import ObjectUtils from '../../utils/ObjectUtils';

const EditionChangeContext = createContext();

const EditionChangeProvider = ({ children }) => {
  const history = useBaseHistory();
  const { editionsUpdateDate, editionHomesUpdateDate } = useFlux();
  const { i18n } = useTranslation();

  const [currentEdition, setCurrentEdition] = useState(null);
  const [editionList, setEditionList] = useState(null);
  const [desiredYear, setDesiredYear] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(swgeLogo);
  const [updateEdition, setUpdateEdition] = useState(true);
  const [updateEditionHome, setUpdateEditionHome] = useState(true);
  const [currentHomeEdition, setCurrentHomeEdition] = useState(null);
  const [editionHomes, setEditionHomes] = useState(null);

  const currentEditionHash = useMemo(() => ObjectUtils.getHash(currentEdition), [currentEdition]);

  const changeEditionByYear = useCallback((year) => {
    setDesiredYear(year);
  }, []);

  const changeEditionToMostRecent = useCallback(() => {
    const eds = _.filter(editionList, (ed) => ed.enabled);
    if (eds.length > 0) {
      const ed = _.maxBy(eds, 'year');
      setCurrentEdition(ed);
      return;
    }
    setCurrentEdition(null);
  }, [editionList]);

  const renderUrl = useCallback(
    (href) => {
      if (currentEdition) {
        return `/${currentEdition.year}${href}`;
      }
      return href;
    },
    [currentEdition]
  );

  useEffect(() => {
    if (desiredYear != null && editionList != null) {
      setDesiredYear(null);
      const edition = _.find(editionList, (ed) => ed.year === desiredYear);
      if (edition == null) {
        setCurrentEdition(null);
        history.replace(`/error/edition-not-found/${desiredYear}`);
        return;
      }
      if (!edition.enabled) {
        setCurrentEdition(null);
        history.replace(`/error/edition-not-enabled/${desiredYear}`);
        return;
      }
      if (currentEdition == null || edition.id !== currentEdition.id) {
        setCurrentEdition(edition);
      }
    }
  }, [currentEdition, desiredYear, editionList, history]);

  useEffect(() => {
    setUpdateEdition(true);
  }, [editionsUpdateDate]);

  useEffect(() => {
    if (i18n.language && currentEdition) {
      EditionService.findLanguageContentByEditionAndLanguage(currentEdition.id, i18n.language).then((response) => {
        if (response.status === 200) {
          setCurrentHomeEdition(response.data);
          return;
        }
        setCurrentHomeEdition(null);
      });
      return;
    }
    setCurrentHomeEdition(null);
  }, [currentEdition, i18n.language]);

  useEffect(() => {
    setUpdateEditionHome(true);
  }, [editionHomesUpdateDate]);

  useEffect(() => {
    if (i18n.language && currentEdition && updateEditionHome) {
      setUpdateEditionHome(false);
      EditionService.findAllEditionHomes(currentEdition.id).then((response) => {
        if (response.status === 200) {
          setEditionHomes(response.data);
          return;
        }
        setEditionHomes(null);
      });
      return;
    }
    setEditionHomes(null);
  }, [currentEdition, i18n.language, updateEditionHome]);

  useEffect(() => {
    if (updateEdition) {
      setUpdateEdition(false);
      EditionService.findAllList().then((response) => {
        if (response.status === 200) {
          setEditionList(response.data);
          const newEdition = _.find(response.data, { id: currentEdition?.id });
          if (ObjectUtils.getHash(newEdition) !== currentEditionHash) {
            setCurrentEdition(newEdition);
          }
        }
      });
    }
  }, [currentEdition?.id, currentEditionHash, updateEdition]);

  useEffect(() => {
    if (currentEdition && currentEdition.logo) {
      FileService.findOne(currentEdition.logo.id).then((response) => {
        if (response.status === 200) {
          setCurrentLogo(
            URL.createObjectURL(
              new Blob([response.data], { type: `image${currentEdition.logo.format === 'svg' ? '/svg+xml' : ''};charset=utf-8` })
            )
          );
          return;
        }
        setCurrentLogo(swgeLogo);
      });
      return;
    }
    setCurrentLogo(swgeLogo);
  }, [currentEdition]);

  return (
    <EditionChangeContext.Provider
      value={{
        currentEdition,
        setCurrentEdition,
        editionList,
        setEditionList,
        changeEditionByYear,
        currentLogo,
        setCurrentLogo,
        changeEditionToMostRecent,
        updateEdition,
        setUpdateEdition,
        renderUrl,
        currentHomeEdition,
        editionHomes,
      }}
    >
      {children}
    </EditionChangeContext.Provider>
  );
};

const useEditionChange = () => {
  const context = useContext(EditionChangeContext);

  if (!context) {
    throw new Error('useEditionChange must be used within an EditionChangeProvider');
  }

  return context;
};

export { EditionChangeProvider, useEditionChange };
