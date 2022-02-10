import { UseFieldConfig } from '../../../Form';

export interface UseCheckboxInput extends Omit<UseFieldConfig<boolean>, 'initialValue'> {
  initialValue?: boolean;
}
