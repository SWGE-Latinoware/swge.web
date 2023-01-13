import React from 'react';
import BasicError, { NOT_ALLOWED } from '../basic-error/BasicError';

const NotAllowed = () => <BasicError errorCode={NOT_ALLOWED} />;

export default NotAllowed;
