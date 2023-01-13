import React from 'react';
import {
  Box, Step, StepLabel, Stepper,
} from '@mui/material';

const StepperW = (props) => {
  const { steps, activeStep, alternativeLabel } = props;

  return (
    <Box width="100%">
      <Stepper activeStep={activeStep} alternativeLabel={alternativeLabel || false}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperW;
