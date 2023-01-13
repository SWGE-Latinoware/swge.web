import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useInstitution from '../hook/useInstitution';

const InstitutionAutoComplete = (props) => {
  const { institutionIds, renderInstitutionName, getInstitutionById } = useInstitution();

  return <AutoCompleteW options={institutionIds} getOptionLabel={(o) => renderInstitutionName(getInstitutionById(o)) || {}} {...props} />;
};
export default InstitutionAutoComplete;
