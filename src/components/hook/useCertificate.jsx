import { useTranslation } from 'react-i18next';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import _ from 'lodash';
import { useToast } from '../context/toast/ToastContext';
import EditionService from '../../services/EditionService';
import { useEditionChange } from '../context/EditionChangeContext';
import { useFlux } from '../context/FluxContext';

const useCertificate = () => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { currentEdition } = useEditionChange();
  const { certificatesUpdateDate } = useFlux();

  const [certificateList, setCertificateList] = useState([]);
  const [updateCertificateList, setUpdateCertificateList] = useState(true);

  const getCertificateById = useCallback((id) => _.find(certificateList, (certificate) => certificate.id === id), [certificateList]);

  const certificateIds = useMemo(() => certificateList.map((certificate) => certificate.id), [certificateList]);

  const getCertificateNameById = useCallback((id) => {
    const certificate = getCertificateById(id);
    if (!certificate) return '';
    return certificate.name;
  }, [getCertificateById]);

  const getCertificateByIds = (ids) => ids.map((id) => getCertificateById(id));

  useEffect(() => {
    if (currentEdition) {
      setUpdateCertificateList(false);
      EditionService.findAllCertificates(currentEdition.id).then((response) => {
        if (response.status === 200) {
          setCertificateList(response.data);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, currentEdition, t, updateCertificateList, certificatesUpdateDate]);

  return {
    getCertificateById,
    certificateIds,
    getCertificateNameById,
    getCertificateByIds,
    certificateList,
    setUpdateCertificateList,
  };
};

export default useCertificate;
