import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import InstitutionService from '../../services/InstitutionService';
import { useToast } from '../context/toast/ToastContext';
import { useFlux } from '../context/FluxContext';

const useInstitution = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { institutionsUpdateDate } = useFlux();

  const [institutionList, setInstitutionList] = useState([]);

  const renderInstitutionName = useCallback((institution) => {
    if (!institution) return '';
    if (institution.shortName) {
      return `${institution.name} (${institution.shortName})`;
    }
    return institution.name;
  }, []);

  const getInstitutionById = useCallback((id) => _.find(institutionList, (institution) => institution.id === id), [institutionList]);
  const institutionIds = useMemo(() => institutionList.map((institution) => institution.id), [institutionList]);

  useEffect(() => {
    InstitutionService.findAllList().then((response) => {
      if (response.status === 200) {
        setInstitutionList(_.sortBy(response.data, 'name'));
        return;
      }
      addToast({ body: t('toastes.fetchError'), type: 'error' });
    });
  }, [addToast, institutionsUpdateDate, t]);

  return {
    renderInstitutionName,
    institutionList,
    institutionIds,
    getInstitutionById,
  };
};

export default useInstitution;
