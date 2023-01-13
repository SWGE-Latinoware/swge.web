import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButton, MenuItem, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import Toolbar from '../../../components/toolbar/Toolbar';
import { useToast } from '../../../components/context/toast/ToastContext';
import TabsPanel from '../../../components/tabs-panel/TabsPanel';
import ButtonW from '../../../components/wrapper/ButtonW';
import ServerSideList from '../../../components/server-side-list/ServerSideList';
import ThemeService from '../../../services/ThemeService';
import ThemeType from '../../../enums/ThemeType';
import { StyledCard, useThemeChange } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import EditionService from '../../../services/EditionService';
import FileService from '../../../services/FileService';
import BoxW from '../../../components/wrapper/BoxW';
import DropzoneAreaW from '../../../components/wrapper/DropzoneAreaW';
import { FLUX_THEMES } from '../../../components/context/FluxContext';
import Selector from '../../../components/form-components/Selector';

const ThemeList = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const { allThemes } = useThemeChange();
  const { currentEdition, setCurrentEdition } = useEditionChange();

  const [defaultLightTheme, setDefaultLightTheme] = useState('');
  const [defaultDarkTheme, setDefaultDarkTheme] = useState('');
  const [uploadLogo, setUploadLogo] = useState(null);

  const [data, setData] = useState([]);

  const initialFile = useMemo(() => currentEdition?.logo && [currentEdition.logo], [currentEdition?.logo]);

  useEffect(() => {
    if (currentEdition) {
      if (currentEdition.defaultDarkTheme) setDefaultDarkTheme(currentEdition.defaultDarkTheme.id);
      if (currentEdition.defaultLightTheme) setDefaultLightTheme(currentEdition.defaultLightTheme.id);
    }
  }, [currentEdition]);

  const renderThemesOptions = useCallback(
    (type) =>
      allThemes
        .filter((item) => ThemeType.getValue(item.type) === ThemeType.getValue(type))
        .map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        )),
    [allThemes]
  );

  const handleDefaultThemeChange = () => {
    if (!currentEdition) {
      addToast({ body: t('toastes.updateError'), type: 'error' });
      return;
    }

    const dark = allThemes.find((item) => item.id === defaultDarkTheme);
    const light = allThemes.find((item) => item.id === defaultLightTheme);

    if (dark) currentEdition.defaultDarkTheme = dark;
    if (light) currentEdition.defaultLightTheme = light;

    if (defaultLightTheme === '') currentEdition.defaultLightTheme = undefined;
    if (defaultDarkTheme === '') currentEdition.defaultDarkTheme = undefined;

    EditionService.update(currentEdition).then((response) => {
      if (response.status === 200) {
        setCurrentEdition(response.data);
        addToast({ body: t('toastes.update'), type: 'success' });
        return;
      }
      addToast({ body: t('toastes.updateError'), type: 'error' });
    });
  };

  const handleLogoChange = () => {
    const form = new FormData();
    const parts = uploadLogo.name.split('.');
    form.append('name', uploadLogo.name.replace(`.${parts[parts.length - 1]}`, ''));
    if (parts.length > 1) {
      form.append('format', parts[parts.length - 1]);
    }
    form.append('file', uploadLogo);
    if (currentEdition.logo) form.append('id', currentEdition.logo.id);
    const operation = (response) => {
      if (response.status === 200) {
        currentEdition.logo = response.data;
        EditionService.update(currentEdition).then((responseE) => {
          if (responseE.status === 200) {
            setCurrentEdition(responseE.data);
            addToast({ body: t('toastes.update'), type: 'success' });
            return;
          }
          addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
        });
        return;
      }
      addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
    };
    const promise = currentEdition.logo ? FileService.update(form) : FileService.create(form);
    promise.then((response) => {
      operation(response);
    });
  };

  const handleLogoDelete = () => {
    const idLogo = currentEdition.logo.id;
    currentEdition.logo = undefined;
    EditionService.update(currentEdition).then((response) => {
      if (response.status === 200) {
        setCurrentEdition(response.data);
        FileService.deleteOne(idLogo).then((responseE) => {
          if (responseE.status === 200) {
            addToast({ body: t('toastes.update'), type: 'success' });
            return;
          }
          addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
        });
        return;
      }
      addToast({ body: t('toastes.uploadFile.error'), type: 'error' });
    });
  };

  const columns = useMemo(
    () => [
      {
        name: 'name',
        label: t('pages.themeList.columns.name'),
        options: {
          filter: true,
        },
      },
      {
        name: 'type',
        label: t('pages.themeList.columns.type'),
        enum: ThemeType,
        options: {
          filter: true,
          filterOptions: {
            renderValue: (type) => t(`enums.themeTypes.${type}`),
          },
          customFilterListOptions: {
            render: (type) => t(`enums.themeTypes.${type}`),
          },
          customBodyRenderLite: (dataIndex) => t(`enums.themeTypes.${data[dataIndex].type}`),
        },
      },
    ],
    [data, t]
  );

  const options = {
    customToolbar: () => (
      <Tooltip title={t('pages.themeList.tooltip.add')}>
        <IconButton onClick={() => history.push('/cli/theme')}>
          <Add />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <>
      <Toolbar title={[t('pages.themeList.toolbar.title'), t('layouts.sidebar.themes')]} hasArrowBack />
      <TabsPanel
        primary
        tabs={[
          { label: t('pages.themeList.choseTheme.themeChoice'), enabled: true },
          { label: t('pages.themeList.choseTheme.allThemes'), enabled: true },
          { label: t('pages.themeList.choseLogo.logo'), enabled: true },
        ]}
        panels={[
          <StyledCard elevation={4}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW width="30%" p={1}>
                <Selector
                  label={t('pages.themeList.choseTheme.light')}
                  onChange={(e) => setDefaultLightTheme(e.target.value)}
                  value={defaultLightTheme}
                  clear
                >
                  {renderThemesOptions('LIGHT')}
                </Selector>
              </BoxW>
              <BoxW width="30%" p={1}>
                <Selector
                  label={t('pages.themeList.choseTheme.dark')}
                  onChange={(e) => setDefaultDarkTheme(e.target.value)}
                  value={defaultDarkTheme}
                  clear
                >
                  {renderThemesOptions('DARK')}
                </Selector>
              </BoxW>
              <BoxW p={1} width="20%">
                <ButtonW fullWidth primary onClick={handleDefaultThemeChange}>
                  {t('pages.themeList.choseTheme.saveChanges')}
                </ButtonW>
              </BoxW>
            </BoxW>
          </StyledCard>,
          <ServerSideList
            {...{
              columns,
              options,
              data,
              setData,
            }}
            enableDefaultUseEffect
            textLabelsCod="themeList"
            defaultOnRowClickURL="/cli/theme"
            defaultService={ThemeService}
            onRowsDeleteErrorToast="toastes.deleteErrors"
            onRowsDeleteToast="toastes.deletes"
            defaultSortOrder={{ name: 'name', direction: 'asc' }}
            fluxListeners={useMemo(() => [FLUX_THEMES], [])}
          />,
          <StyledCard elevation={4}>
            <BoxW flexDirection="row" display="flex" flexWrap="wrap" alignItems="center">
              <BoxW p={1} width="100%">
                <DropzoneAreaW initialFiles={initialFile} onChange={(files) => setUploadLogo(files[0])} />
              </BoxW>
            </BoxW>
            <BoxW display="flex" flexDirection="row" flexWrap="wrap" p={1} width="100%" justifyContent="center" alignItems="center">
              <BoxW p={1} width="25%">
                <ButtonW fullWidth primary onClick={handleLogoChange} disabled={!uploadLogo || !currentEdition}>
                  {t('pages.themeList.choseLogo.saveLogo')}
                </ButtonW>
              </BoxW>
              <BoxW p={1} width="25%">
                <ButtonW fullWidth error onClick={handleLogoDelete} disabled={!currentEdition?.logo}>
                  {t('pages.themeList.choseLogo.deleteLogo')}
                </ButtonW>
              </BoxW>
            </BoxW>
          </StyledCard>,
        ]}
      />
    </>
  );
};

export default ThemeList;
