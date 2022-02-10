import { UseFieldConfig } from '../../../Form';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface UseTextInput extends Omit<UseFieldConfig<string>, 'initialValue'> {
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
}
