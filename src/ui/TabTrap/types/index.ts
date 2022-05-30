import { ReactNode, RefObject } from 'react';

export interface TabTrapProps {
  active?: boolean;
  children: ReactNode;
}

export interface FocusableHTMLElement extends HTMLElement {
  focus: HTMLOrSVGElement['focus'];
}

export interface TabTrapContext {
  firstTabFocusableRef: RefObject<FocusableHTMLElement>;
  lastTabFocusableRef: RefObject<FocusableHTMLElement>;
}
