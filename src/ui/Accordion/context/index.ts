import { createContext } from 'react';

import { AccordionContext } from '../types';

export const accordionContext = createContext<AccordionContext>({
  addAccordion: () => {
    // default implementation
  },
  closeInAccordionGroup: () => {
    // default implementation
  },
  openInAccordionGroup: () => {
    // default implementation
  },
  removeAccordion: () => {
    // default implementation
  }
});
