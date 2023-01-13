import axios from 'axios';
import { compareAsc, fromUnixTime } from 'date-fns';
import Agent, { HttpsAgent } from 'agentkeepalive';
import { getToken, login, logout, setPreviousAllowedUrl } from './Auth';

const authApi = axios.create({
  httpAgent: new Agent({
    keepAlive: true,
    freeSocketTimeout: 10000,
  }),
  httpsAgent: new HttpsAgent({
    keepAlive: true,
    freeSocketTimeout: 10000,
  }),
  timeout: 0,
  // maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
  // baseURL: `http://${window.location.host}/`,
  headers: {
    // 'Cache-Control': 'no-cache',
    // Pragma: 'no-cache',
    // Expires: '0',
  },
});

authApi.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    logout();
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => {
    const auth = response.headers.authorization;
    if (auth) {
      const newToken = auth.replace('Bearer ', '');
      const time = fromUnixTime(JSON.parse(window.atob(newToken.split('.')[1])).exp);
      if (compareAsc(time, new Date()) <= 0) return response;
      login(newToken);
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      switch (window.location.pathname) {
        case '/login':
        case '/auto-registration':
        case '/reset-password':
          break;
        default:
          if (window.location.pathname.split('/').at(-1) !== 'login') {
            setPreviousAllowedUrl(window.location.pathname);
            window.location = '/login';
          }
      }
      logout();
    }
    return Promise.reject(error);
  }
);

export default authApi;
