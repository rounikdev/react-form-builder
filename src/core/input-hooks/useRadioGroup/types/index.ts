/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

import { ExtractorFromSingleOption } from '../../types';

export type RadioGroupLabel = any;
export type RadioGroupOption = any;
export type RadioGroupValue = any;

export interface UseRadioGroup extends Omit<UseFieldConfig<RadioGroupValue>, 'initialValue'> {
  initialValue?: RadioGroupValue;
  inputValueExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupValue[];
  titleExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupValue>;
}

export interface UseRadioGroupReturnType<T, R> extends UseFieldReturnType<RadioGroupValue> {
  enhancedOptions: {
    checked: boolean;
    inputValue: string;
    label: R;
    onChangeHandler: () => void;
    title: string;
    value: T;
  }[];
}
