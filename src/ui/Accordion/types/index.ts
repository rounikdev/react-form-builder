import { ReactNode } from 'react';

import { Stylable, Testable } from '../../../types';

export interface AccordionContext {
  closeInGroup: (id: string) => void;
  openedControlledAccordions: string[];
  openInGroup: (id: string) => void;
}

export interface RenderHeaderArgs {
  close: () => void;
  disabled?: boolean;
  id: string;
  isOpen?: boolean;
  open: () => void;
}

export interface UseAccordionArgs {
  children: ReactNode;
  disabled?: boolean;
  excludeFromGroup?: boolean;
  id: string;
  keepMounted?: boolean;
  opened?: boolean;
}

export interface AccordionProps extends UseAccordionArgs, Stylable, Testable {
  renderHeader: (params: RenderHeaderArgs) => ReactNode;
}

export interface AccordionGroupProps {
  children: ReactNode;
  maxOpened: number;
}
