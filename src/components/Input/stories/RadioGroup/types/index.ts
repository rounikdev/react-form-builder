import { Field } from '../../../../Form/types';

import { ExtractFromSingleOption } from '../../../types';
import { RadioGroupLabel, RadioGroupOption, RadioGroupValue } from '../../../useRadioGroup/types';

export interface RadioGroupProps extends Omit<Field<RadioGroupValue>, 'initialValue'> {
  groupLabel?: string;
  initialValue?: RadioGroupValue;
  inputValueExtractor?: ExtractFromSingleOption<RadioGroupOption, string>;
  labelExtractor?: ExtractFromSingleOption<RadioGroupOption, RadioGroupLabel>;
  options: RadioGroupOption[];
  titleExtractor?: ExtractFromSingleOption<RadioGroupOption, string>;
  valueExtractor?: ExtractFromSingleOption<RadioGroupOption, RadioGroupValue>;
}
