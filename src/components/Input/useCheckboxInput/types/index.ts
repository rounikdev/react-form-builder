import { Disableable } from '../../../../types';
import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

export interface UseCheckboxInput
  extends Omit<UseFieldConfig<boolean>, 'initialValue'>,
    Disableable {
  initialValue?: boolean;
}

export interface UseCheckboxInputReturn extends UseFieldReturnType<boolean>, Disableable {}
