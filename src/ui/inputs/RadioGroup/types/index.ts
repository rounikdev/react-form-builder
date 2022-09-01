import {
  ExtractorFromSingleOption,
  Field,
  RadioGroupLabel,
  RadioGroupOption,
  RadioGroupValue
} from '@core';

export interface RadioGroupProps extends Field<RadioGroupValue> {
  direction?: 'Row' | 'Column';
  groupLabel?: string;
  inputValueExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupOption[];
  titleExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupValue>;
}
