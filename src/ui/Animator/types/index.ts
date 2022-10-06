import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListAnimatorChild = ReactElement<any, string | JSXElementConstructor<any>>;

export interface ListAnimatorProps extends Stylable {
  children?: ListAnimatorChild[];
  enterClass: string;
  exitClass: string;
  tag?: keyof JSX.IntrinsicElements;
}
export interface ListAnimatorState {
  content: ListAnimatorChild[] | null;
}
