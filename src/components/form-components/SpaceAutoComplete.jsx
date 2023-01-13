import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import { useFlux } from '../context/FluxContext';
import InstitutionService from '../../services/InstitutionService';
import { useToast } from '../context/toast/ToastContext';
import { EDIT_INSTITUTION } from '../form-generic/FormDialog';

const SpaceAutoComplete = (props) => {
  const { institutionId, ...otherProps } = props;

  const { institutionsUpdateDate } = useFlux();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    if (institutionId) {
      InstitutionService.findOne(institutionId).then((response) => {
        if (response.status === 200) {
          setSpaces(response.data.spaces);
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, institutionId, institutionsUpdateDate, t]);

  const spacesIds = spaces?.map((space) => space.id);

  const renderSpaceName = (id) => {
    const spc = spaces?.find((space) => space.id === id);
    if (!spc) return '';
    return spc.name;
  };

  const link = institutionId ? EDIT_INSTITUTION : undefined;

  return <AutoCompleteW link={link} options={spacesIds} getOptionLabel={renderSpaceName} {...otherProps} />;
};

export default SpaceAutoComplete;
