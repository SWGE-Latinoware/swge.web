import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { useThemeChange } from '../context/ThemeChangeContext';
import GestureDoubleTap from '../../assets/image/gesture-double-tap.svg';
import GestureTap from '../../assets/image/gesture-tap.svg';
import GestureSwipeRight from '../../assets/image/gesture-swipe-right.svg';

const JoyrideW = (props) => {
  const { run, setRun, steps, dislocation, isSwipe, ...otherProps } = props;

  const { currentTheme } = useThemeChange();
  const { t } = useTranslation();

  const [tourIndex, setTourIndex] = useState(0);

  const pulse = keyframes`
    0% {
      transform: scale(1);
    }
    
    55% { 
      background: url('${GestureTap}') 0 0 / 40px 40px;
      transform: scale(1.6);
    }
  `;

  const swipePulse = keyframes`
    0% {
      -webkit-transform: translateX(0);
              transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(50px);
              transform: translateX(50px);
    }
`;

  const BeaconSwipe = styled.button`
    animation: ${swipePulse} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite both;
    background: url('${GestureSwipeRight}') 0 0 / 70px 70px;
    display: inline-block;
    border: 0px;
    height: 5em;
    width: 5em;
    left: -50px;
    ${dislocation &&
    tourIndex === 0 &&
    `position: absolute;
     top: ${dislocation}`}
  `;

  // eslint-disable-next-line no-unused-vars
  const Beacon = styled.button`
    animation: ${pulse} 1s ease-in-out infinite;
    background: url('${GestureDoubleTap}') 0 0 / 40px 40px;
    display: inline-block;
    border: 0px;
    height: 3em;
    width: 3em;
    ${dislocation &&
    tourIndex === 0 &&
    `position: absolute;
    top: ${dislocation}`}
  `;

  const handleTour = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setTourIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      beaconComponent={isSwipe && tourIndex === 0 ? BeaconSwipe : Beacon}
      showSkipButton
      continuous
      showProgress
      disableCloseOnEsc
      styles={{
        options: {
          zIndex: currentTheme.zIndex.drawer + 1000,
          primaryColor: currentTheme.palette.primary.main,
          textColor: currentTheme.palette.text.primary,
          backgroundColor: currentTheme.palette.background.default,
          arrowColor: currentTheme.palette.background.default,
        },
      }}
      run={run}
      steps={steps}
      callback={handleTour}
      stepIndex={tourIndex}
      locale={t('enums.tour', { returnObjects: true })}
      {...otherProps}
    />
  );
};

export default JoyrideW;
