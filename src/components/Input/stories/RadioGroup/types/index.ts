import { Field } from '../../../../Form/types';

import { ExtractorFromSingleOption } from '../../../types';
import { RadioGroupLabel, RadioGroupOption, RadioGroupValue } from '../../../useRadioGroup/types';

export interface RadioGroupProps extends Omit<Field<RadioGroupValue>, 'initialValue'> {
  groupLabel?: string;
  initialValue?: RadioGroupValue;
  inputValueExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupOption[];
  titleExtractor?: ExtractorFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractorFromSingleOption<RadioGroupOption, RadioGroupValue>;
}
