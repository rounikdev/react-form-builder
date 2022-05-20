import { ReactNode } from 'react';

import { Stylable, Testable } from '../../../types';

export interface AddAccordionArgs {
  close: () => void;
  id: string;
  open: () => void;
}

export interface OpenInAccordionGroupArgs {
  id: string;
  keepOpened: boolean;
}

export interface AccordionContext {
  addAccordion: (params: AddAccordionArgs) => void;
  closeInAccordionGroup: (id: string) => void;
  openInAccordionGroup: (params: OpenInAccordionGroupArgs) => void;
  removeAccordion: (id: string) => void;
}

export interface RenderHeaderArgs {
  close: () => void;
  disabled: boolean;
  id: string;
  isOpen: boolean;
  open: () => void;
}

export interface UseAccordionArgs {
  children: ReactNode;
  disabled?: boolean;
  id: string;
  keepMounted?: boolean;
  keepOpened?: boolean;
  opened?: boolean;
}

export interface AccordionProps extends UseAccordionArgs, Stylable, Testable {
  renderHeader: (params: RenderHeaderArgs) => ReactNode;
}

export interface AccordionGroupProps {
  children: ReactNode;
  maxOpened: number;
}

export interface OpenedAccordion {
  id: string;
  keepOpened: boolean;
}

export type AccordionControls = {
  [key: string]: {
    close(): void;
    open(): void;
  };
};
