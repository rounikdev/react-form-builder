import { ReactNode, MouseEventHandler } from 'react';

import { Stylable, Testable } from '../../../types';
export interface UseCarouselConfig<T> {
  auto?: boolean;
  interval?: number;
  items: T[];
  keepDirection?: boolean;
  startIndex: number;
  styles: { MoveToLeft: string; MoveToRight: string; ToRight: string };
  toLeft?: boolean;
}

export interface CarouselProps<T> extends Stylable, Testable, Omit<UseCarouselConfig<T>, 'styles'> {
  extractId?: (item: T | null) => string;
  label: string;
  pausable?: boolean;
  renderFrame: (item: T | null) => ReactNode;
  renderLeftButton: (params: { dataTest: string; onClick: MouseEventHandler }) => ReactNode;
  renderMenu: (params: {
    current: T | null;
    dataTest: string;
    items: T[];
    move: (index?: number) => void;
  }) => ReactNode;
  renderRightButton: (params: { dataTest: string; onClick: MouseEventHandler }) => ReactNode;
}

export interface CarouselState<T> {
  current: T | null;
  currentIndex: number;
  next: T | null;
  toLeft?: boolean;
  trackStyle: string;
}
