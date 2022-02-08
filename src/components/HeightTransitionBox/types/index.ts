import { ReactNode, TransitionEventHandler } from 'react';

import { Stylable } from '../../../types';

export interface HeightTransitionBoxProps extends Stylable {
  children?: ReactNode;
  contentClassName?: string;
  dataTest?: string;
  memoizeChildren?: boolean;
  onTransitionEnd?: TransitionEventHandler | null;
  transitionDuration?: number;
  transitionType?: string;
}

export interface HeightTransitionBoxContext {
  actions: { forceUpdate: () => void };
  shouldForceUpdate: Record<string, unknown>;
}