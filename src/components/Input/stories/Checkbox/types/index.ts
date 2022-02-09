import { Field, UseFieldConfig } from '../../../../Form/types';

export interface InputCheckboxProps extends Omit<UseFieldConfig<boolean>, 'initialValue'>, Field {
  initialValue?: boolean;
}
