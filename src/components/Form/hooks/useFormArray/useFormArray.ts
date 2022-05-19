import { useCallback, useState } from 'react';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { GlobalModel } from '@services';

import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '../../constants';
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
    resetFlag,
    resetRecords
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

  useUpdateOnly(() => {
    if (
      resetFlag.resetKey &&
      (fieldId.indexOf(resetFlag.resetKey) === 0 ||
        resetFlag.resetKey === ROOT_RESET_RECORD_KEY ||
        resetFlag.resetKey === INITIAL_RESET_RECORD_KEY)
    ) {
      const resetValue = (GlobalModel.getNestedValue(
        resetRecords[resetFlag.resetKey],
        fieldId.split('.')
      ) || []) as T[];

      // Reset array to prevent existing items
      // to read from the reset state with old names
      // For example item with index 0 should get
      // index 1, but because reset flag is set
      // before the array will be updated. that
      // item will still have index 0 and will
      // get the values of the 0-th array element
      // instead of the one with index 1:
      setList([]);

      // Prevent UI from flickering because
      // the rerendering of the array:
      requestAnimationFrame(() => setList(resetValue));
    }
  }, [resetFlag]);

  return { add, list, remove };
};
