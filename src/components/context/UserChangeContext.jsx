import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addBusinessDays } from 'date-fns';
import UserService from '../../services/UserService';
import { getUserEmail, logout, setPreviousAllowedUrl } from '../../services/Auth';
import EditionService from '../../services/EditionService';
import { useEditionChange } from './EditionChangeContext';
import { useFlux } from './FluxContext';
import ObjectUtils from '../../utils/ObjectUtils';
import FileService from '../../services/FileService';
import { useToast } from './toast/ToastContext';

const UserChangeContext = createContext();

const EMPTY_EMAIL = '_';

const UserChangeProvider = ({ children }) => {
  const { currentEdition } = useEditionChange();
  const { usersUpdateDate } = useFlux();

  const { addToast } = useToast();
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [userEmail, setUserEmail] = useState(getUserEmail() || EMPTY_EMAIL);
  const [updateUser, setUpdateUser] = useState(true);
  const [isCoordinator, setCoordinator] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [isSpeaker, setSpeaker] = useState(false);
  const [isSecretary, setSecretary] = useState(false);
  const [isDPO, setDPO] = useState(false);
  const [isGridCoordinator, setGridCoordinator] = useState(false);

  const currentUserHash = useMemo(() => ObjectUtils.getHash(currentUser), [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUserEmail(null);
    setPreviousAllowedUrl(null);
    logout();
  };

  useEffect(() => {
    setUpdateUser(true);
  }, [usersUpdateDate]);

  useEffect(() => {
    if (userEmail == null && updateUser) {
      setCurrentUser(null);
      return;
    }
    if (userEmail != null && userEmail !== EMPTY_EMAIL && updateUser) {
      setUpdateUser(false);
      UserService.findOneByEmail(userEmail).then((response) => {
        if (response.status === 200) {
          const newUser = response.data;
          if (ObjectUtils.getHash(newUser) !== currentUserHash) {
            if (newUser != null && !newUser.enabled) {
              handleLogout();
              return;
            }
            setCurrentUser(newUser);
          }
          return;
        }
        setCurrentUser(null);
      });
    }
  }, [userEmail, updateUser, currentUserHash]);

  useEffect(() => {
    if (currentUser) {
      currentUser.exclusionRequests.forEach((exclusionRequest) => {
        if (exclusionRequest.status === 'NOT_ANALYZED')
          currentUser.exclusion = { date: addBusinessDays(new Date(exclusionRequest.registryDate), 15), isApproved: false };
        if (exclusionRequest.status === 'APPROVED')
          currentUser.exclusion = { date: exclusionRequest.deadlineExclusionDate, isApproved: true };
        setCurrentUser(currentUser);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentEdition || !currentUser) {
      setCoordinator(false);
      setSpeaker(false);
      setSecretary(false);
      return;
    }
    EditionService.isCoordinator(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) setCoordinator(response.data);
      else setCoordinator(false);
    });
    EditionService.isSpeaker(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) setSpeaker(response.data);
      else setSpeaker(false);
    });
    EditionService.isSecretary(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) setSecretary(response.data);
      else setSecretary(false);
    });
    EditionService.isDPO(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) setDPO(response.data);
      else setDPO(false);
    });
    EditionService.isGridCoordinator(currentEdition.id, currentUser.id).then((response) => {
      if (response.status === 200) setGridCoordinator(response.data);
      else setGridCoordinator(false);
    });
  }, [currentEdition, currentUser]);

  useEffect(() => {
    if (currentUser?.userProfile) {
      FileService.findOne(currentUser.userProfile.id).then((response) => {
        if (response.status === 200) {
          setUserImage(
            URL.createObjectURL(
              new Blob([response.data], { type: `image${currentUser.userProfile.format === 'svg' ? '/svg+xml' : ''};charset=utf-8` })
            )
          );
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
      return;
    }

    setUserImage(null);
  }, [addToast, t, currentUser]);

  return (
    <UserChangeContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userEmail,
        setUserEmail,
        updateUser,
        setUpdateUser,
        isCoordinator,
        isSpeaker,
        isSecretary,
        isDPO,
        isGridCoordinator,
        handleLogout,
        userImage,
        setUserImage,
      }}
    >
      {children}
    </UserChangeContext.Provider>
  );
};

const useUserChange = () => {
  const context = useContext(UserChangeContext);

  if (!context) {
    throw new Error('useUserChange must be used within an UserChangeProvider');
  }

  return context;
};

export { UserChangeProvider, useUserChange };
