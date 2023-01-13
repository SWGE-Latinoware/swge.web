import React from 'react';
import BasicError, { EDITION_NOT_FOUND } from '../../errors/basic-error/BasicError';

const EditionNotFound = () => (
  <BasicError
    errorCode={EDITION_NOT_FOUND}
  />
);

export default EditionNotFound;
