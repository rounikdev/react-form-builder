import { ReactNode } from 'react';

import { Stylable } from '../../../types';

export interface AnimatorProps extends Stylable {
  shouldAnimate?: (currentChildren: ReactNode, newChildren: ReactNode) => boolean;
  tag?: keyof JSX.IntrinsicElements;
  enterClass: string;
  exitClass: string;
}

export interface AnimatorState {
  content: ReactNode;
  exiting: boolean;
}
