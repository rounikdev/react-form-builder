import { Field, UseFieldConfig, UseFieldReturnType } from '../../../Form';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseInput<T> extends UseFieldConfig<T>, Omit<Field, 'dataTest' | 'id'> {
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export interface UseInputReturnType<T> extends UseFieldReturnType<T> {
  disabled?: boolean;
}
