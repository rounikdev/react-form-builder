import { Field } from '../../../../core';

export interface CheckboxProps extends Omit<Field<boolean>, 'initialValue'> {
  initialValue?: boolean;
}
