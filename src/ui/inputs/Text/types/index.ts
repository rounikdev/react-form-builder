import { Field, InputOnBlurSideEffect } from '@core';

export interface TextProps extends Field<string> {
  autoComplete?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  pattern?: string;
  type?: string;
}
