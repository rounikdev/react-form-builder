import { Field } from '../../../../components';

export interface CheckboxProps extends Omit<Field<boolean>, 'initialValue'> {
  initialValue?: boolean;
}
