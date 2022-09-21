import { ReactNode } from 'react';

import { Stylable } from '@types';

export interface IconContainerProps extends Stylable {
  action?: boolean;
  children?: ReactNode;
  light?: boolean;
}

export type IconProps = IconContainerProps;
