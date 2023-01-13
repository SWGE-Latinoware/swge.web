import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './i18n';
import '@fontsource/roboto';

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
