import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { useEditionChange } from '../context/EditionChangeContext';
import useBaseHistory from './useBaseHistory';
import { useUserChange } from '../context/UserChangeContext';
import { getUserEmail } from '../../services/Auth';

const useEditionHistory = () => {
  const {
    currentEdition, changeEditionByYear, changeEditionToMostRecent,
  } = useEditionChange();
  const history = useBaseHistory();
  const { setUserEmail } = useUserChange();

  const originalPush = history.push;
  const originalReplace = history.replace;

  const getPathName = (path) => {
    if (path.match(/^\/\d+(\/.*)?/) == null) {
      return `/${currentEdition.year}${path}`;
    }
    return path;
  };

  const urlMonitor = useCallback((location) => {
    if (location.pathname.match(/^\/\d+(\/.*)?/) != null) {
      const year = location.pathname.split('/')[1];
      changeEditionByYear(Number.parseInt(year, 10));
    } else {
      changeEditionToMostRecent();
    }
    setUserEmail(getUserEmail());
  }, [changeEditionByYear, changeEditionToMostRecent, setUserEmail]);

  useEffect(() => history.listen((location) => {
    urlMonitor(location);
  }), [history, urlMonitor]);

  useEffect(() => {
    urlMonitor(history.location);
  }, [history.location, urlMonitor]);

  useEffect(() => {
    if (currentEdition) {
      const path = history.location.pathname;
      if (path.match(/^\/\d+(\/.*)?/) == null) {
        history.replace(`/${currentEdition.year}${path}`);
      }
    }
  }, [currentEdition, history, history.location]);

  const handlePathChange = (originalOperation, path, state) => {
    if (currentEdition == null) {
      originalOperation(path, state);
      return;
    }
    if (typeof path === 'string') {
      const newPath = getPathName(path);
      originalOperation(newPath, state);
      return;
    }
    const newPath = _.clone(path);
    newPath.pathname = getPathName(newPath.pathname);
    originalOperation(newPath, state);
  };

  history.push = (path, state) => {
    handlePathChange(originalPush, path, state);
  };

  history.replace = (path, state) => {
    handlePathChange(originalReplace, path, state);
  };

  return history;
};

export default useEditionHistory;
