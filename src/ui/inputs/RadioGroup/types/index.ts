import {
  Field,
  ExtractorFromSingleOption,
  RadioGroupLabel,
  RadioGroupOption,
  RadioGroupValue
} from '@core';

export interface RadioGroupProps extends Omit<Field<RadioGroupValue>, 'initialValue'> {
  direction?: 'Row' | 'Column';
  groupLabel?: string;
  initialValue?: RadioGroupValue;
  inputValueExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupOption[];
  titleExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupValue>;
}
