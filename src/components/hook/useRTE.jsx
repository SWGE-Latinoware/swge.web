import { convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import parse from 'html-react-parser';
import { useCallback, useMemo } from 'react';
import { useThemeChange } from '../context/ThemeChangeContext';

const useRTE = () => {
  const { currentTheme } = useThemeChange();

  const options = useMemo(
    () => ({
      entityStyleFn: (entity) => {
        switch (entity.type) {
          case 'IMAGE':
            return {
              element: 'img',
              attributes: {
                src: entity.data.url,
              },
            };
          case 'LINK':
            return {
              element: 'a',
              attributes: {
                target: '_blank',
                href: entity.data.url,
                rel: 'noreferrer',
              },
              style: {
                textDecorationLine: 'underline',
                cursor: 'pointer',
                color: currentTheme.palette.text.primary,
              },
            };
          default:
            return null;
        }
      },
    }),
    [currentTheme]
  );

  const renderFromState = useCallback(
    (state) => {
      const draftState = convertFromRaw(state);
      const html = stateToHTML(draftState, options);
      return parse(html);
    },
    [options]
  );

  const convertStateToRaw = useCallback((state) => convertToRaw(state.getCurrentContent()), []);

  const convertStateToHtml = useCallback((state) => stateToHTML(state.getCurrentContent()), []);

  return {
    renderFromState,
    convertStateToRaw,
    convertStateToHtml,
  };
};

export default useRTE;
