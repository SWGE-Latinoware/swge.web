export const TOKEN_KEY = 'id_token';
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const THEME_MODE = 'darkMode';
export const PREVIOUS_ALLOWED_URL = 'previousAllowedUrl';

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getUserEmail = () => {
  if (!localStorage.getItem(TOKEN_KEY)) {
    return null;
  }
  try {
    return JSON.parse(window.atob(localStorage.getItem(TOKEN_KEY).split('.')[1])).sub;
  } catch (e) {
    return null;
  }
};

export const setPreviousAllowedUrl = (url) => {
  localStorage.setItem(PREVIOUS_ALLOWED_URL, url);
};

export const getPreviousAllowedUrl = () => localStorage.getItem(PREVIOUS_ALLOWED_URL);

export const setThemeUser = (darkChoice) => {
  if (darkChoice) localStorage.setItem(THEME_MODE, 'enable');
  else localStorage.setItem(THEME_MODE, 'disable');
  document.getElementById('main').style.backgroundColor = darkChoice ? '#303030' : '#E8E8E8';
};

export const getThemeUser = () => {
  if (!localStorage.getItem(THEME_MODE)) return false;
  return localStorage.getItem(THEME_MODE) === 'enable';
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
