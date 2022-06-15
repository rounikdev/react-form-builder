import { FocusEventHandler, MouseEventHandler } from 'react';

import { DependencyExtractor, Formatter, Validator } from '@core';
import { Testable } from '@types';

export interface ShowHideProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (show: boolean, data: any) => JSX.Element | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  show: boolean;
}

export interface TestInputProps<T> {
  dataTestInput: string;
  dataTestState?: string;
  dependencyExtractor?: DependencyExtractor;
  formatter?: Formatter<T>;
  initialValue?: T;
  name: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  sideEffect?: ({ value }: { value: T }) => void;
  validator?: Validator<T>;
}

export interface TestButtonProps extends Testable {
  disabled?: boolean;
  onClick: MouseEventHandler;
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}
