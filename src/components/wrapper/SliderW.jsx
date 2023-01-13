import React from 'react';
import { Slider } from '@mui/material';

const SliderW = (props) => <Slider valueLabelDisplay="auto" min={0} max={100} defaultValue={0} steps={1} {...props} />;

export default SliderW;
