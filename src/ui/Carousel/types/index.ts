import { ReactNode, MouseEventHandler } from 'react';

export interface CarouselProps<T> {
  auto?: boolean;
  className?: string;
  extractId?: (item: T | null) => string;
  items: T[];
  interval?: number;
  keepDirection?: boolean;
  pausable?: boolean;
  renderFrame: (item: T | null) => ReactNode;
  renderLeftButton: (params: { onClick: MouseEventHandler }) => ReactNode;
  renderMenu: (params: {
    current: T | null;
    items: T[];
    move: (index?: number) => void;
  }) => ReactNode;
  renderRightButton: (params: { onClick: MouseEventHandler }) => ReactNode;
  startIndex: number;
  toLeft: boolean;
}

export interface CarouselState<T> {
  current: T | null;
  currentIndex: number;
  next: T | null;
  toLeft: boolean;
  trackStyle: string;
}
