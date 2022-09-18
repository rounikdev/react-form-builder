import { ReactNode } from 'react';

import { Stylable } from '@types';

export interface AnimatorProps extends Stylable {
  children?: ReactNode;
  enterClass: string;
  exitClass: string;
  shouldAnimate?: (currentChildren: ReactNode, newChildren: ReactNode) => boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export interface AnimatorState {
  content: ReactNode;
  exiting: boolean;
}
