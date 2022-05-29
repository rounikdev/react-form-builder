import { createContext } from 'react';

import { AccordionContext } from '../types';

export const accordionContext = createContext<AccordionContext>({
  closeInGroup: () => {
    // default implementation
  },
  openedControlledAccordions: [],
  openInGroup: () => {
    // default implementation
  }
});
