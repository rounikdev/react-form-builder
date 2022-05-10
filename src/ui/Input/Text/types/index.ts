import { Field, InputOnBlurSideEffect } from '../../../../components';

export interface TextProps extends Omit<Field<string>, 'initialValue'> {
  autoComplete?: string;
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  pattern?: string;
  type?: string;
}
