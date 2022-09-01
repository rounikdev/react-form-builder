import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

export type InputOnBlurSideEffect = ({
  setValue,
  value
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseTextInput extends UseFieldConfig<string> {
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export type UseTextInputReturnType = UseFieldReturnType<string>;
