import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useCertificate from '../hook/useCertificate';

const CertificateAutoComplete = (props) => {
  const {
    link,
    ...otherProps
  } = props;

  const {
    certificateIds, getCertificateNameById,
  } = useCertificate();

  return (
    <AutoCompleteW
      link={link}
      options={certificateIds || []}
      getOptionLabel={(o) => getCertificateNameById(o)}
      {...otherProps}
    />
  );
};

export default CertificateAutoComplete;
