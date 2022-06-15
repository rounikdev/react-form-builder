import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

export interface UseCheckboxInput extends Omit<UseFieldConfig<boolean>, 'initialValue'> {
  initialValue?: boolean;
}

export type UseCheckboxReturnType = UseFieldReturnType<boolean>;
