import { Field } from '../../../../Form/types';

export interface InputCheckboxProps extends Omit<Field<boolean>, 'initialValue'> {
  initialValue?: boolean;
}
