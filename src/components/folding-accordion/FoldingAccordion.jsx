import React, { useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, styled, Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const AccordionHead = styled(AccordionSummary)(({
  '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
    color: 'inherit',
  },
}));

const FoldingAccordion = (props) => {
  const {
    panels, title, accordionProps, expanded,
  } = props;

  const finalExpanded = expanded || false;

  const [currentExpanded, setCurrentExpanded] = useState(finalExpanded);

  return (
    <Accordion elevation={4} expanded={currentExpanded} {...accordionProps}>
      <AccordionHead
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setCurrentExpanded(!currentExpanded)}
      >
        <Typography>{title}</Typography>
      </AccordionHead>
      {panels.map((panel, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <AccordionDetails key={idx}>
          {panel}
        </AccordionDetails>
      ))}
    </Accordion>
  );
};

export default FoldingAccordion;
