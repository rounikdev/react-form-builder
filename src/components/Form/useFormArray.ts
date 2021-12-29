import { useCallback, useState } from 'react';

import { GlobalModel } from '@services';

import { UseFormArrayParams } from './types';

export const useFormArray = function <T>({ initialValue, factories }: UseFormArrayParams<T>) {
  const [state, setState] = useState<T[]>(GlobalModel.deepClone(initialValue));

  const add = useCallback(
    (...params) => {
      setState((currentState) => {
        const newState = [...currentState];

        const factoryKey = params.pop();
        const factory: () => T = factories[factoryKey];

        const target = GlobalModel.getNestedValue(newState, params) as T[];
        target.push(factory());

        return newState;
      });
    },
    [factories]
  );

  const onReset = useCallback(() => {
    setState(GlobalModel.deepClone(initialValue));
  }, [initialValue]);

  const remove = useCallback((...params) => {
    setState((currentState) => {
      const newState = [...currentState];

      const index = params.pop();

      const target = GlobalModel.getNestedValue(newState, params);
      target.splice(index, 1);

      return newState;
    });
  }, []);

  return { add, onReset, state, remove };
};
