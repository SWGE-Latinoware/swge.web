import countries from 'i18n-iso-countries';

const getCountries = (i18nLangs) => {
  const langs = i18nLangs.map((l) => l.split('-')[0]);
  langs.forEach((l) => {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`));
  });
  return countries;
};

export default getCountries;
