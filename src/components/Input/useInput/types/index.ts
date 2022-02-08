import { Field, UseFieldConfig, UseFieldReturnType } from '../../../Form';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseInput extends UseFieldConfig<string>, Omit<Field, 'dataTest' | 'id'> {
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export interface UseInputReturnType extends UseFieldReturnType<string> {
  disabled?: boolean;
}
