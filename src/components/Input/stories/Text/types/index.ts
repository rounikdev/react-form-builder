import { Field, UseFieldConfig } from '../../../../Form/types';

import { InputOnBlurSideEffect } from '../../../useTextInput/types';

export interface InputTextProps
  extends Omit<UseFieldConfig<string>, 'initialValue'>,
    Omit<Field, 'initialValue'> {
  autoComplete?: string;
  expandError?: boolean;
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  styles: { [key: string]: string };
  type?: string;
}
