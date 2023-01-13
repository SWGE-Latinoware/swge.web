import React from 'react';
import BasicError, { NOT_FOUND } from '../basic-error/BasicError';

const PageNotFound = () => (
  <BasicError
    errorCode={NOT_FOUND}
  />
);

export default PageNotFound;
