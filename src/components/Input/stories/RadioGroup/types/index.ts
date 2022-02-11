import { Field } from '../../../../Form/types';

import {
  RadioGroupLabelExtractor,
  RadioGroupOption,
  RadioGroupValue,
  RadioGroupValueExtractor
} from '../../../useRadioGroup/types';

export interface RadioGroupProps extends Omit<Field<RadioGroupValue>, 'initialValue'> {
  groupLabel?: string;
  initialValue?: RadioGroupValue;
  labelExtractor?: RadioGroupLabelExtractor;
  options: RadioGroupOption[];
  valueExtractor?: RadioGroupValueExtractor;
}
