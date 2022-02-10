import { Field } from '../../../../Form/types';

import { InputOnBlurSideEffect } from '../../../useTextInput/types';

export interface InputTextProps extends Omit<Field<string>, 'initialValue'> {
  autoComplete?: string;
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  type?: string;
}
