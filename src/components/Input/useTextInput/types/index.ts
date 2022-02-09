import { Disableable } from '../../../../types';
import { UseFieldConfig, UseFieldReturnType } from '../../../Form';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseInput extends UseFieldConfig<string>, Disableable {
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export interface UseInputReturnType extends UseFieldReturnType<string>, Disableable {}
