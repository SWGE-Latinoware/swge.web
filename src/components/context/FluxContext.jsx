import React, { createContext, useContext, useEffect, useState } from 'react';
import _ from 'lodash';

export const FLUX_USERS = 'FLUX_USERS';
export const FLUX_TUTORED_USERS = 'FLUX_TUTORED_USERS';
export const FLUX_INSTITUTIONS = 'FLUX_INSTITUTIONS';
export const FLUX_CARAVANS = 'FLUX_CARAVANS';
export const FLUX_EDITIONS = 'FLUX_EDITIONS';
export const FLUX_TRACKS = 'FLUX_TRACKS';
export const FLUX_ACTIVITIES = 'FLUX_ACTIVITIES';
export const FLUX_CERTIFICATES = 'FLUX_CERTIFICATES';
export const FLUX_CARAVAN_ENROLLMENTS = 'FLUX_CARAVAN_ENROLLMENTS';
export const FLUX_CARAVAN_TUTORED_ENROLLMENTS = 'FLUX_CARAVAN_TUTORED_ENROLLMENTS';
export const FLUX_REGISTRATIONS = 'FLUX_REGISTRATIONS';
export const FLUX_TUTORED_REGISTRATIONS = 'FLUX_TUTORED_REGISTRATIONS';
export const FLUX_THEMES = 'FLUX_THEMES';
export const FLUX_FEEDBACKS = 'FLUX_FEEDBACKS';
export const FLUX_VOUCHERS = 'FLUX_VOUCHERS';
export const FLUX_EXCLUSIONS = 'FLUX_EXCLUSIONS';
export const FLUX_EDITION_HOMES = 'FLUX_EDITION_HOMES';

const FluxContext = createContext();

const FluxProvider = ({ children }) => {
  const [usersUpdateDate, setUsersUpdateDate] = useState(0);
  const [tutoredUsersUpdateDate, setTutoredUsersUpdateDate] = useState(0);
  const [institutionsUpdateDate, setInstitutionsUpdateDate] = useState(0);
  const [caravansUpdateDate, setCaravansUpdateDate] = useState(0);
  const [editionsUpdateDate, setEditionsUpdateDate] = useState(0);
  const [tracksUpdateDate, setTracksUpdateDate] = useState(0);
  const [activitiesUpdateDate, setActivitiesUpdateDate] = useState(0);
  const [certificatesUpdateDate, setCertificatesUpdateDate] = useState(0);
  const [caravanEnrollmentsUpdateDate, setCaravanEnrollmentsUpdateDate] = useState(0);
  const [caravanTutoredEnrollmentsUpdateDate, setCaravanTutoredEnrollmentsUpdateDate] = useState(0);
  const [registrationsUpdateDate, setRegistrationsUpdateDate] = useState(0);
  const [tutoredRegistrationsUpdateDate, setTutoredRegistrationsUpdateDate] = useState(0);
  const [themesUpdateDate, setThemeUpdateDate] = useState(0);
  const [feedbacksUpdateDate, setFeedbacksUpdateDate] = useState(0);
  const [vouchersUpdateDate, setVouchersUpdateDate] = useState(0);
  const [exclusionsUpdateDate, setExclusionsUpdateDate] = useState(0);
  const [editionHomesUpdateDate, setEditionHomesUpdateDate] = useState(0);

  useEffect(() => {
    let url = 'http://localhost:8080/api/flux/all';
    if (process.env.NODE_ENV === 'production') {
      url = '/api/flux/all';
    }
    const source = new EventSource(url);
    const cache = {
      usersUpdateDate: 0,
      tutoredUsersUpdateDate: 0,
      institutionsUpdateDate: 0,
      caravansUpdateDate: 0,
      editionsUpdateDate: 0,
      tracksUpdateDate: 0,
      activitiesUpdateDate: 0,
      certificatesUpdateDate: 0,
      caravanEnrollmentsUpdateDate: 0,
      caravanTutoredEnrollmentsUpdateDate: 0,
      registrationsUpdateDate: 0,
      tutoredRegistrationsUpdateDate: 0,
      themesUpdateDate: 0,
      feedbacksUpdateDate: 0,
      vouchersUpdateDate: 0,
      exclusionsUpdateDate: 0,
      editionHomesUpdateDate: 0,
    };
    source.onmessage = (response) => {
      const data = JSON.parse(response.data);
      _.forOwn(data, (value, key) => {
        if (value !== cache[key]) {
          cache[key] = value;
          switch (key) {
            case 'usersUpdateDate':
              setUsersUpdateDate(value);
              break;
            case 'tutoredUsersUpdateDate':
              setTutoredUsersUpdateDate(value);
              break;
            case 'institutionsUpdateDate':
              setInstitutionsUpdateDate(value);
              break;
            case 'caravansUpdateDate':
              setCaravansUpdateDate(value);
              break;
            case 'editionsUpdateDate':
              setEditionsUpdateDate(value);
              break;
            case 'tracksUpdateDate':
              setTracksUpdateDate(value);
              break;
            case 'activitiesUpdateDate':
              setActivitiesUpdateDate(value);
              break;
            case 'certificatesUpdateDate':
              setCertificatesUpdateDate(value);
              break;
            case 'caravanEnrollmentsUpdateDate':
              setCaravanEnrollmentsUpdateDate(value);
              break;
            case 'caravanTutoredEnrollmentsUpdateDate':
              setCaravanTutoredEnrollmentsUpdateDate(value);
              break;
            case 'registrationsUpdateDate':
              setRegistrationsUpdateDate(value);
              break;
            case 'tutoredRegistrationsUpdateDate':
              setTutoredRegistrationsUpdateDate(value);
              break;
            case 'themesUpdateDate':
              setThemeUpdateDate(value);
              break;
            case 'feedbacksUpdateDate':
              setFeedbacksUpdateDate(value);
              break;
            case 'vouchersUpdateDate':
              setVouchersUpdateDate(value);
              break;
            case 'exclusionsUpdateDate':
              setExclusionsUpdateDate(value);
              break;
            case 'editionHomesUpdateDate':
              setEditionHomesUpdateDate(value);
              break;
            default:
          }
        }
      });
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <FluxContext.Provider
      value={{
        usersUpdateDate,
        tutoredUsersUpdateDate,
        institutionsUpdateDate,
        caravansUpdateDate,
        editionsUpdateDate,
        tracksUpdateDate,
        activitiesUpdateDate,
        certificatesUpdateDate,
        caravanEnrollmentsUpdateDate,
        caravanTutoredEnrollmentsUpdateDate,
        registrationsUpdateDate,
        tutoredRegistrationsUpdateDate,
        themesUpdateDate,
        feedbacksUpdateDate,
        vouchersUpdateDate,
        exclusionsUpdateDate,
        editionHomesUpdateDate,
      }}
    >
      {children}
    </FluxContext.Provider>
  );
};

const useFlux = () => {
  const context = useContext(FluxContext);

  if (!context) {
    throw new Error('useFlux must be used within an FluxProvider');
  }

  return context;
};

export { FluxProvider, useFlux };
