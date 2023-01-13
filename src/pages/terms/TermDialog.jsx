import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomDialog from '../../components/custom-dialog/CustomDialog';
import TermComponent from './TermComponent';

const TermDialog = (props) => {
  const { termName } = props;

  const { t } = useTranslation();

  const titleName = () => {
    const names = termName.split('-');
    if (names.length === 1) {
      return names[0];
    }
    let result = names[0];
    for (let i = 1; i < names.length; i += 1) {
      result += names[i].replace(names[i][0], names[i][0].toUpperCase());
    }
    return result;
  };

  return (
    <>{termName && <CustomDialog title={t(`pages.terms.${titleName()}`)} content={<TermComponent termName={termName} />} {...props} />}</>
  );
};

export default TermDialog;
