import { Disableable } from '../../../../types';
import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseTextInput extends Omit<UseFieldConfig<string>, 'initialValue'>, Disableable {
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export interface UseTextInputReturn extends UseFieldReturnType<string>, Disableable {}
