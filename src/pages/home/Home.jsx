import React from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useRTE from '../../components/hook/useRTE';
import HelmetW from '../../components/wrapper/HelmetW';
import { useEditionChange } from '../../components/context/EditionChangeContext';

const Home = () => {
  const { renderFromState } = useRTE();
  const { currentHomeEdition } = useEditionChange();
  const { i18n } = useTranslation();

  const { t } = useTranslation();

  const raw = {
    blocks: [
      {
        key: '9fhdl',
        text: i18n.language === 'pt-BR' ? 'Tela Inicial do Sistema!' : 'System Home Screen!',
        type: 'header-two',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: 26,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: 'f78g6',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: 'bitdp',
        text:
          i18n.language === 'pt-BR'
            ? 'É possível o administrador editar o conteúdo desta página no menu "Customização" / "Tela de Início".'
            : 'It is possible for the administrator to edit the content of this page in the "Customization" / "Home Screen" menu',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: i18n.language === 'pt-BR' ? 65 : 77,
            length: i18n.language === 'pt-BR' ? 34 : 32,
            style: 'BOLD',
          },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: '31t3u',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '7pa97',
        text:
          i18n.language === 'pt-BR'
            ? 'Se encontrar algum problema ou tiver alguma sugestão, fique à vontade para nos informar clicando aqui ou abrindo o menu lateral e selecionando "Feedback" / "Meus Feedbacks".'
            : 'If you encounter any problems or have any suggestions, feel free to let us know by clicking here or by opening the side menu and selecting "Feedback" / "My Feedbacks".',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          {
            offset: i18n.language === 'pt-BR' ? 143 : 138,
            length: 29,
            style: 'BOLD',
          },
        ],
        entityRanges: [
          {
            offset: i18n.language === 'pt-BR' ? 97 : 92,
            length: 4,
            key: 0,
          },
        ],
        data: {},
      },
      {
        key: 'em9g1',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '9hpf1',
        text:
          i18n.language === 'pt-BR' ? 'Agradecemos sua compreensão e colaboração.' : 'We appreciate your understanding and collaboration.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: '7149b',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          url: '/cli/my-feedbacks',
          className: 'MUIRichTextEditor-anchorLink-26',
        },
      },
    },
  };

  return (
    <>
      <HelmetW title={t('layouts.sidebar.dashboard')} />
      <Box p={2} flexDirection="row" display="flex" flexWrap="wrap" alignItems="center" justifyContent="center">
        <Box p={1} paddingTop="24px" width="40%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          {renderFromState(currentHomeEdition ? currentHomeEdition.homeContent : raw)}
        </Box>
      </Box>
    </>
  );
};

export default Home;
