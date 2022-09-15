import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

export type InputOnBlurSideEffect = ({
  setValue,
  value
}: {
  setValue?: (value: string) => void;
  value: string;
}) => string;

export interface UseTextInput extends UseFieldConfig<string> {
  onBlurSideEffect?: InputOnBlurSideEffect;
}

export type UseTextInputReturnType = UseFieldReturnType<string>;
