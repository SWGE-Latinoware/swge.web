import React from 'react';
import { Chip } from '@mui/material';
import TagIcon from 'mdi-react/TagIcon';
import { useThemeChange } from '../../context/ThemeChangeContext';

const TrackTag = (props) => {
  const { name, calendarColor } = props;
  const { currentTheme } = useThemeChange();

  return (
    <Chip
      icon={<TagIcon color={calendarColor && currentTheme?.palette.getContrastText(calendarColor)} />}
      label={name}
      sx={(theme) => ({
        backgroundColor: calendarColor,
        marginRight: '5px',
        color: calendarColor && theme.palette.getContrastText(calendarColor),
      })}
    />
  );
};

export default TrackTag;
