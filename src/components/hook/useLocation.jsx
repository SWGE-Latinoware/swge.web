import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { MenuItem } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getParamByISO } from 'iso-country-currency';
import CepService from '../../services/CepService';
import { useToast } from '../context/toast/ToastContext';
import getCountries from '../../utils/CountryUtils';
import citiesCache from '../../assets/ibge/cities.json';
import ufsCache from '../../assets/ibge/ufs.json';

const useLocation = () => {
  const { addToast } = useToast();
  const { t, i18n } = useTranslation();

  const [ufList, setUfList] = useState({});
  const [citiesList, setCitiesList] = useState({ '': [] });

  const countries = getCountries(Object.keys(i18n.store.data));

  const countryObj = countries.getNames(i18n.language.split('-')[0], { select: 'official' });

  useEffect(() => {
    CepService.getUFs().then((response) => {
      if (response.status === 200) {
        setUfList(response.data);
        return;
      }
      setUfList(ufsCache);
    });
    CepService.getCities().then((response) => {
      let cities = citiesCache;
      if (response.status === 200) {
        cities = response.data;
      }
      setCitiesList(cities);
    });
  }, [addToast, t]);

  const applyCEP = useCallback(
    (cep, setValue) => {
      const numberCep = cep.replace('-', '');
      CepService.getCEP(numberCep).then((response) => {
        if (response == null) {
          addToast({ body: t('toastes.cepFetchError'), type: 'error' });
          return;
        }
        if (response.status !== 200 || response.data == null || response.data.error) {
          addToast({ body: t('toastes.cepFetchError'), type: 'error' });
          setValue('city', '');
          setValue('state', '');
          setValue('addressLine2', '');
          setValue('addressLine1', '');
          return;
        }
        const cepData = response.data;
        setValue('state', cepData.state);
        setValue('addressLine2', '');
        setValue('addressLine1', `${cepData.address}, ${cepData.district}${cepData.complement !== '' ? `, ${cepData.complement}` : ''}`);
        setValue('city', cepData.city);
      });
    },
    [addToast, t]
  );

  return {
    monitorCEP: useCallback(
      (e, setValue) =>
        setValue('zipCode', e.target.value) ||
        (!e.target.value.includes('_') && e.target.value.length === 9 && applyCEP(e.target.value, setValue)),
      [applyCEP]
    ),
    applyCEP,
    countries,
    renderCountryItems: useCallback(
      () =>
        _.map(countryObj, (name, code) => (
          <MenuItem key={code + name} value={code}>
            {name}
          </MenuItem>
        )),
      [countryObj]
    ),
    renderCountryList: useCallback(() => _.keys(countryObj), [countryObj]),
    renderStateList: useCallback(() => ufList && _.keys(ufList), [ufList]),
    renderCityList: useCallback((uf) => (uf && citiesList && citiesList[uf]) || [], [citiesList]),
    renderCityItems: useCallback(
      (watch) => {
        const uf = watch('state', '');
        return citiesList[uf]
          ? citiesList[uf].map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))
          : undefined;
      },
      [citiesList]
    ),
    ufList,
    citiesList,
    isCountryName: useCallback(
      (countryName) =>
        _.findKey(
          countries.getNames(i18n.language.split('-')[0], { select: 'official' }),
          (obj) =>
            obj
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') ===
            countryName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
        ),
      [countries, i18n.language]
    ),
    getCountryName: useCallback(
      (countryCod) => countries.getNames(i18n.language.split('-')[0], { select: 'official' })[countryCod],
      [countries, i18n.language]
    ),
    getStateName: useCallback((id) => id && ufList && ufList[id], [ufList]),
    isStateName: useCallback(
      (stateName) =>
        _.findKey(
          ufList,
          (obj) =>
            obj
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') ===
            stateName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
        ),
      [ufList]
    ),
    isCityName: useCallback(
      (cityName) =>
        _.find(
          _.flatMap(citiesList),
          (obj) =>
            obj
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') ===
            cityName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
        ),
      [citiesList]
    ),
    formatState: useCallback(
      (state) => {
        const ufSelected = ufList[state];
        if (ufSelected == null) {
          return state;
        }
        return ufSelected;
      },
      [ufList]
    ),
    formatCurrency: useCallback(
      (value) => new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'BRL' }).format(value),
      [i18n.language]
    ),
    formatCurrencySymbol: useMemo(() => getParamByISO('BR', 'symbol'), []),
    formatLocaleDateString: useCallback((date) => new Date(date).toLocaleDateString(i18n.language, {}), [i18n.language]),
    formatLocaleString: useCallback((date) => new Date(date).toLocaleString(i18n.language, {}), [i18n.language]),
    formatLocaleTimeString: useCallback(
      (date) => new Date(date).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
      [i18n.language]
    ),
    formatLocaleTimeWithFormatString: useCallback(
      (date) => {
        if (i18n.language.startsWith('en'))
          return new Date(date).toLocaleTimeString(i18n.language, { hour12: true, hour: 'numeric', minute: 'numeric' });
        return new Date(date).toLocaleTimeString(i18n.language, { hour: 'numeric', minute: 'numeric' });
      },
      [i18n.language]
    ),
  };
};

export default useLocation;
