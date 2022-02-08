import { FC, useCallback, useState } from 'react';

import { useUpdate } from '@services';

import { FormArrayWrapperProps, FormStateEntryValue } from './types';

export const FormArrayWrapper: FC<FormArrayWrapperProps> = ({
  children,
  factory,
  initialValue = [],
  resetFlag
}) => {
  const [state, setState] = useState<FormStateEntryValue[]>(initialValue);

  const add = useCallback(
    () => setState((currentState) => (factory ? [...currentState, factory()] : currentState)),
    [factory]
  );

  const remove = useCallback(
    (index: number) => setState((currentState) => currentState.filter((_, i) => i !== index)),
    []
  );

  useUpdate(() => setState(initialValue), [resetFlag]);

  return typeof children === 'function' ? children([state, add, remove]) : children;
};

FormArrayWrapper.displayName = 'FormArrayWrapper';
