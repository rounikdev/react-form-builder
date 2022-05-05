import { useCallback, useState } from 'react';

import { GlobalModel, useUpdateOnly } from '@services';

import { INITIAL_RESET_RECORD_KEY } from '../../constants';
import { useFormRoot } from '../../providers';

export const useFormArray = <T>({
  factory,
  fieldId,
  initialValue = []
}: {
  factory: () => T;
  fieldId: string;
  initialValue?: T[];
}) => {
  const {
    methods: { setDirty },
    resetFlag: rootResetFlag,
    resetRecords
  } = useFormRoot();

  const [list, setList] = useState<T[]>(initialValue);

  const add = useCallback(() => {
    setDirty();
    setList((currentList) => (factory ? [...currentList, factory()] : currentList));
  }, [factory, setDirty]);

  const remove = useCallback(
    (index: number) => {
      setDirty();
      setList((currentState) => currentState.filter((_, i) => i !== index));
    },
    [setDirty]
  );

  useUpdateOnly(() => {
    if (
      rootResetFlag.resetKey &&
      (fieldId.indexOf(rootResetFlag.resetKey) === 0 ||
        rootResetFlag.resetKey === 'root' ||
        rootResetFlag.resetKey === INITIAL_RESET_RECORD_KEY)
    ) {
      const resetValue = (GlobalModel.getNestedValue(
        resetRecords[rootResetFlag.resetKey],
        fieldId.split('.')
      ) ?? []) as T[];

      if (resetValue) {
        // Reset array to prevent existing items
        // to read from the reset state with old names
        // For example item with index 0 should get
        // index 1, but because reset flag is set
        // before the array will be updated. that
        // item will still have index 0 and will
        // get the values of the 0-th array element
        // instead of the one with index 1:
        setList([]);

        requestAnimationFrame(() => {
          setList(resetValue);
        });
      }
    }
  }, [rootResetFlag]);

  return { add, list, remove };
};
