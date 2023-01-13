import React from 'react';
import BasicError, { EDITION_NOT_ENABLED } from '../../errors/basic-error/BasicError';

const EditionNotEnabled = () => (
  <BasicError
    errorCode={EDITION_NOT_ENABLED}
  />
);

export default EditionNotEnabled;
