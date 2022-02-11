import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

export interface UseCheckboxInput extends Omit<UseFieldConfig<boolean>, 'initialValue'> {
  initialValue?: boolean;
}

export type UseCheckboxReturnType = UseFieldReturnType<boolean>;
