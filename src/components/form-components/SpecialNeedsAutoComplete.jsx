import React from 'react';
import { useTranslation } from 'react-i18next';
import ChipAutoComplete from './ChipAutoComplete';
import SpecialNeedsType from '../../enums/SpecialNeedsType';

const SpecialNeedsAutoComplete = (props) => {
  const { ...otherProps } = props;
  const { t } = useTranslation();

  return (
    <ChipAutoComplete
      options={SpecialNeedsType.enums.map((item) => item.value)}
      getOptionLabel={(o) => t(`enums.specialNeeds.${SpecialNeedsType.getKey(o)}`)}
      {...otherProps}
    />
  );
};

export default SpecialNeedsAutoComplete;
