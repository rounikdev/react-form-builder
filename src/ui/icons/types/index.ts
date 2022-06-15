import { Stylable } from '@types';

export interface IconContainerProps extends Stylable {
  action?: boolean;
  light?: boolean;
}

export type IconProps = IconContainerProps;
