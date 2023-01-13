import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useToast } from '../context/toast/ToastContext';
import EditionService from '../../services/EditionService';
import { useEditionChange } from '../context/EditionChangeContext';
import { useFlux } from '../context/FluxContext';

const useGridCoordinator = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { usersUpdateDate } = useFlux();

  const [gridCoordinatorList, setGridCoordinatorList] = useState([]);

  const getGridCoordinatorById = useCallback(
    (id) => _.find(gridCoordinatorList, (gridCoordinator) => gridCoordinator.id === id),
    [gridCoordinatorList]
  );

  const gridCoordinatorIds = useMemo(() => gridCoordinatorList.map((gridCoordinator) => gridCoordinator.id), [gridCoordinatorList]);

  const getGridCoordinatorNameById = useCallback(
    (id) => {
      const gridCoordinator = getGridCoordinatorById(id);
      if (!gridCoordinator) return '';
      return gridCoordinator.name;
    },
    [getGridCoordinatorById]
  );

  const getGridCoordinatorByIds = (ids) => ids.map((id) => getGridCoordinatorById(id));

  useEffect(() => {
    if (currentEdition) {
      EditionService.findAllGridCoordinators(currentEdition.id).then((response) => {
        if (response.status === 200) {
          setGridCoordinatorList(response.data);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, usersUpdateDate]);

  return {
    getGridCoordinatorById,
    gridCoordinatorIds,
    getGridCoordinatorNameById,
    getGridCoordinatorByIds,
  };
};

export default useGridCoordinator;
