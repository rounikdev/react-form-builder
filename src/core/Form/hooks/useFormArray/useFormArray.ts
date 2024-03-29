import { dequal } from 'dequal';
import { useCallback, useState } from 'react';

import { useIsMounted, useLayoutUpdateOnly, useUpdate } from '@rounik/react-custom-hooks';

import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '@core/Form/constants';
import { useFormRoot } from '@core/Form/providers';
import { shouldBeReset } from '@core/Form/services';
import { GlobalModel } from '@services';

const defaultValue: unknown = [];

export const useFormArray = <T>({
  factory,
  fieldId,
  initialValue = defaultValue as T[]
}: {
  factory: () => T;
  fieldId: string;
  initialValue?: T[];
}) => {
  const {
    fieldsToBeSet,
    methods: { setDirty },
    resetFlag,
    resetRecords,
    usesStorage
  } = useFormRoot();

  const [list, setList] = useState<T[]>(initialValue);

  const add = useCallback(() => {
    setDirty();
    setList((currentList) => [...currentList, factory()]);
  }, [factory, setDirty]);

  const remove = useCallback(
    (index: number) => {
      setDirty();
      setList((currentState) => currentState.filter((_, i) => i !== index));
    },
    [setDirty]
  );

  const isMounted = useIsMounted();

  useUpdate(() => {
    if (fieldsToBeSet[fieldId] !== undefined) {
      setDirty();

      setList(fieldsToBeSet[fieldId]);
    }
  }, [fieldsToBeSet]);

  useLayoutUpdateOnly(() => {
    if (isMounted.current && shouldBeReset({ fieldId, resetFlag })) {
      let resetValue: T[] = [];

      if (usesStorage) {
        resetValue = (GlobalModel.getNestedValue(
          resetRecords[resetFlag.resetKey || INITIAL_RESET_RECORD_KEY],
          fieldId.split('.')
        ) ??
          GlobalModel.getNestedValue(resetRecords[INITIAL_RESET_RECORD_KEY], fieldId.split('.')) ??
          defaultValue) as T[];
      } else {
        resetValue = (GlobalModel.getNestedValue(
          resetRecords[resetFlag.resetKey || ROOT_RESET_RECORD_KEY],
          fieldId.split('.')
        ) ?? initialValue) as T[];
      }

      if (!dequal(resetValue, list)) {
        // Reset array to prevent existing items
        // to read from the reset state with old names
        // For example item with index 0 should get
        // index 1, but because reset flag is set
        // before the array will be updated. that
        // item will still have index 0 and will
        // get the values of the 0-th array element
        // instead of the one with index 1:
        setList(defaultValue as T[]);

        // Prevent UI from flickering because
        // the rerendering of the array:
        queueMicrotask(() => setList(resetValue));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetFlag]);

  return { add, list, remove };
};
