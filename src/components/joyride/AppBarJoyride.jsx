import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import JoyrideW from './JoyrideW';
import EditionMenuActionGif from '../../assets/image/edition-menu-action.gif';
import LanguageActionGif from '../../assets/image/language-action.gif';
import ThemeActionGif from '../../assets/image/theme-action.gif';
import SideBarActionGif from '../../assets/image/side-bar-action.gif';
import UserMenuActionGif from '../../assets/image/user-menu-action.gif';

export const JoyrideContentWithGif = (props) => {
  const { content, gif, width, height } = props;

  return (
    <Box width="100%">
      <Typography fontSize={16}>{content}</Typography>
      <Box p={1} component="svg" height={height} width={width}>
        <image href={gif} height={height} width={width} />
      </Box>
    </Box>
  );
};

const AppBarJoyride = (props) => {
  const { ...otherProps } = props;
  const { t } = useTranslation();

  const steps = [
    {
      title: t('steps.appBar.user.title'),
      content: <JoyrideContentWithGif content={t('steps.appBar.user.content')} gif={UserMenuActionGif} height="250px" width="280px" />,
      target: '#user-menu',
    },
    {
      title: t('steps.appBar.language.title'),
      content: <JoyrideContentWithGif content={t('steps.appBar.language.content')} gif={LanguageActionGif} height="200px" width="280px" />,
      target: '#language-button',
    },
    {
      title: t('steps.appBar.theme.title'),
      content: <JoyrideContentWithGif content={t('steps.appBar.theme.content')} gif={ThemeActionGif} height="200px" width="280px" />,
      target: '#theme-button',
    },
    {
      title: t('steps.appBar.edition.title'),
      content: (
        <JoyrideContentWithGif content={t('steps.appBar.edition.content')} gif={EditionMenuActionGif} height="200px" width="280px" />
      ),
      target: '#edition-button',
    },
    {
      title: t('steps.appBar.sideBar.title'),
      content: <JoyrideContentWithGif content={t('steps.appBar.sideBar.content')} gif={SideBarActionGif} height="280px" width="360px" />,
      target: '#sidebar-button',
    },
  ];

  return <JoyrideW steps={steps} {...otherProps} />;
};

export default AppBarJoyride;
