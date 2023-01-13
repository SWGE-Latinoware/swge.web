import React, { useEffect, useMemo, useState } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Locales from 'date-fns/locale';
import 'pace-js';
import { enUS, ptBR } from '@mui/material/locale';
import { ToastProvider } from './components/context/toast/ToastContext';
import { composeDefaultTheme, ThemeChangeProvider } from './components/context/ThemeChangeContext';
import useEditionHistory from './components/hook/useEditionHistory';
import { EditionChangeProvider } from './components/context/EditionChangeContext';
import Routes from './Routes';
import { UserChangeProvider } from './components/context/UserChangeContext';
import { GlobalLoadingProvider } from './components/context/GlobalLoadingContext';
import { FluxProvider } from './components/context/FluxContext';
import './App.css';
import HelmetW from './components/wrapper/HelmetW';

const RouterWay = () => {
  const history = useEditionHistory();

  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  const lt = useMemo(() => {
    if (i18n.language === 'pt-BR') return composeDefaultTheme('light', ptBR);
    return composeDefaultTheme('light', enUS);
  }, [i18n.language]);

  const dt = useMemo(() => {
    if (i18n.language === 'pt-BR') return composeDefaultTheme('dark', ptBR);
    return composeDefaultTheme('dark', enUS);
  }, [i18n.language]);

  const [currentTheme, setCurrentTheme] = useState(lt);

  useEffect(() => {
    setCurrentTheme(lt);
  }, [lt]);

  return (
    <>
      <HelmetW />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={currentTheme}>
          <ToastProvider>
            <FluxProvider>
              <EditionChangeProvider>
                <UserChangeProvider>
                  <GlobalLoadingProvider>
                    <ThemeChangeProvider defaultLight={lt} defaultDark={dt} currentTheme={currentTheme} setCurrentTheme={setCurrentTheme}>
                      <LocalizationProvider locale={Locales[i18n.language.replace('-', '')]} dateAdapter={AdapterDateFns}>
                        <CssBaseline enableColorScheme />
                        <RouterWay />
                      </LocalizationProvider>
                    </ThemeChangeProvider>
                  </GlobalLoadingProvider>
                </UserChangeProvider>
              </EditionChangeProvider>
            </FluxProvider>
          </ToastProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default App;
