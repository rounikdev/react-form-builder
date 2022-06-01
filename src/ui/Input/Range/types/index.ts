import { Dispatch, FocusEventHandler, SetStateAction } from 'react';

import { Field } from '../../../../components';

export type RangeOptions = number[];

export interface RangeValue {
  from: number;
  to: number;
}

export interface RangeProps extends Field<RangeValue> {
  initialValue?: RangeValue;
  max?: number;
  min?: number;
  options?: RangeOptions;
}

export interface RangeHandleProps {
  clientX: number;
  isMoving: {
    from: boolean;
    to: boolean;
  };
  limit: (value: number) => number;
  min?: number;
  name: 'from' | 'to';
  onBlur: FocusEventHandler;
  onChange: (value: RangeValue) => Promise<void>;
  onFocus: FocusEventHandler;
  options?: RangeOptions;
  pixelsPerUnit: number;
  setIsMoving: Dispatch<
    SetStateAction<{
      from: boolean;
      to: boolean;
    }>
  >;
  unitsPerPixel: number;
  value: RangeValue;
}
