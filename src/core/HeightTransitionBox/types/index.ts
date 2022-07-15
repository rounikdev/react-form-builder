import { CSSProperties, MutableRefObject, ReactNode, TransitionEventHandler } from 'react';

import { Stylable } from '@types';

export interface HeightTransitionBoxProps extends Stylable {
  children?: ReactNode;
  contentClassName?: string;
  dataTest?: string;
  isRoot?: boolean;
  memoizeChildren?: boolean;
  onTransitionEnd?: TransitionEventHandler | null;
  ref?: MutableRefObject<HTMLDivElement | null>;
  style?: CSSProperties;
  transitionDuration?: number;
  transitionType?: string;
}

export interface HeightTransitionBoxContext {
  actions: { forceUpdate: () => void };
  shouldForceUpdate: Record<string, unknown>;
}

export interface HeightTransitionProviderProps {
  children: ReactNode;
}
