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
        const factory = factories[factoryKey];

        const target = GlobalModel.getNestedValue(newState, params);
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
      const newData = [...currentState];

      const index = params.pop();

      const target = GlobalModel.getNestedValue(newData, params);
      target.splice(index, 1);

      return newData;
    });
  }, []);

  return { state, add, onReset, remove };
};
