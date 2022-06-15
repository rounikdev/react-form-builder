import { Field, InputOnBlurSideEffect } from '../../../../core';

export interface TextProps extends Omit<Field<string>, 'initialValue'> {
  autoComplete?: string;
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  pattern?: string;
  type?: string;
}
