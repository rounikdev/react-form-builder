import { Field, UseFieldConfig } from '../../../Form/types';

export type InputOnBlurSideEffect = ({
  value,
  setValue
}: {
  value: string;
  setValue?: (value: string) => void;
}) => string;

export interface InputBasicProps
  extends Omit<UseFieldConfig<string>, 'initialValue'>,
    Omit<Field, 'initialValue'> {
  autoComplete?: string;
  expandError?: boolean;
  initialValue?: string;
  onBlurSideEffect?: InputOnBlurSideEffect;
  styles: { [key: string]: string };
  type?: string;
}

export interface InputPrimaryProps
  extends Omit<UseFieldConfig<string>, 'initialValue'>,
    Omit<Field, 'initialValue'>,
    Omit<InputBasicProps, 'styles'> {
  initialValue?: string;
}
