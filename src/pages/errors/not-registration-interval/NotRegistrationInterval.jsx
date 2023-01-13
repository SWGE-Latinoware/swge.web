import React from 'react';
import BasicError, { REGISTRATION_INTERVAL } from '../basic-error/BasicError';

const NotRegistrationInterval = () => <BasicError errorCode={REGISTRATION_INTERVAL} />;

export default NotRegistrationInterval;
