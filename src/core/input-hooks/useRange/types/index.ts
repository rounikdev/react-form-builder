import { Dispatch, FocusEventHandler, MouseEventHandler, RefObject, SetStateAction } from 'react';

import { FormStateEntryValue, UseFieldConfig } from '@core/Form/types';

export type RangeOptions = number[];

export interface RangeValue {
  from: number;
  to: number;
}

export interface UseRangeArgs extends Omit<UseFieldConfig<RangeValue>, 'initialValue'> {
  initialValue?: UseFieldConfig<RangeValue>['initialValue'];
  label?: string | ((dependencyValue: FormStateEntryValue) => string);
  max?: number;
  min?: number;
  options?: RangeOptions;
  required?: boolean | ((dependencyValue: FormStateEntryValue) => boolean);
  single?: boolean;
  step: number;
  stepExtra: number;
}

export interface RangeContext {
  barStyle: {
    left: number;
    width: number;
  };
  clientX: number;
  isMoving: { from: boolean; to: boolean };
  limitFrom: (from: number) => number;
  limitTo: (to: number) => number;
  max?: number;
  min?: number;
  move: MouseEventHandler;
  onBlurHandler: FocusEventHandler;
  onChangeHandler: (value: RangeValue) => void;
  onFocusHandler: FocusEventHandler;
  onTrackClickHandler: MouseEventHandler;
  options?: RangeOptions;
  pixelsPerUnit: number;
  setIsMoving: Dispatch<
    SetStateAction<{
      from: boolean;
      to: boolean;
    }>
  >;
  single?: boolean;
  step: number;
  stepExtra: number;
  stopMove: () => void;
  trackRef: RefObject<HTMLDivElement>;
  unitsPerPixel: number;
  value: RangeValue;
}
