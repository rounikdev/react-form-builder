/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

import { ExtractFromSingleOption } from '../../types';

export type RadioGroupLabel = any;
export type RadioGroupOption = any;
export type RadioGroupValue = any;

export interface UseRadioGroup extends Omit<UseFieldConfig<RadioGroupValue>, 'initialValue'> {
  initialValue?: RadioGroupValue;
  inputValueExtractor?: ExtractFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupValue[];
  titleExtractor?: ExtractFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractFromSingleOption<RadioGroupOption, RadioGroupValue>;
}

export interface UseRadioGroupReturnType<T, R> extends UseFieldReturnType<RadioGroupValue> {
  wrappedOptions: {
    checked: boolean;
    inputValue: string;
    label: R;
    onChangeHandler: () => void;
    title: string;
    value: T;
  }[];
}
