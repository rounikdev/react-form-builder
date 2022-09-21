import { createContext } from 'react';

import { RangeContext } from '../types';

export const rangeContext = createContext<RangeContext>({
  barStyle: {
    left: 0,
    width: 0
  },
  clientX: 0,
  isMoving: { from: false, to: false },
  limitFrom: (from: number) => {
    // Default implementation

    return from;
  },
  limitTo: (to: number) => {
    // Default implementation

    return to;
  },
  max: 0,
  min: 0,
  move: () => {
    // Default implementation
  },
  onBlurHandler: () => {
    // Default implementation
  },
  onChangeHandler: () => {
    // Default implementation
  },
  onFocusHandler: () => {
    // Default implementation
  },
  onTrackClickHandler: () => {
    // Default implementation
  },
  options: undefined,
  pixelsPerUnit: 0,
  setIsMoving: () => {
    // Default implementation
  },
  single: false,
  step: 1,
  stepExtra: 1,
  stopMove: () => {
    // Default implementation
  },
  trackRef: { current: null },
  unitsPerPixel: 0,
  value: {
    from: 0,
    to: 0
  }
});

rangeContext.displayName = 'RangeContext';
