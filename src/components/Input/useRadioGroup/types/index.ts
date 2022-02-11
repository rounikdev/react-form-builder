/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

import { LabelExtractor, ValueExtractor } from '../../types';

export type RadioGroupLabel = any;
export type RadioGroupOption = any;
export type RadioGroupValue = any;

export type RadioGroupLabelExtractor = LabelExtractor<RadioGroupOption, RadioGroupLabel>;
export type RadioGroupValueExtractor = ValueExtractor<RadioGroupOption, RadioGroupValue>;

export interface UseRadioGroup extends Omit<UseFieldConfig<RadioGroupValue>, 'initialValue'> {
  initialValue?: RadioGroupValue;
  labelExtractor?: RadioGroupLabelExtractor;
  options: RadioGroupValue[];
  valueExtractor?: RadioGroupValueExtractor;
}

export interface UseRadioGroupReturnType extends UseFieldReturnType<RadioGroupValue> {
  wrappedOptions: {
    checked: boolean;
    label: RadioGroupLabel;
    onChangeHandler: () => void;
    value: RadioGroupValue;
  }[];
}
