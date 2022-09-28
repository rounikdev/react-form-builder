import { useUpdateOnlyExtended } from '@rounik/react-custom-hooks';

import {
  INITIAL_RESET_RECORD_KEY,
  ROOT_RESET_RECORD_KEY,
  STORAGE_RESET_KEY
} from '@core/Form/constants';
import { useFormRoot } from '@core/Form/providers';
import { shouldBeReset } from '@core/Form/services';
import { FormStateEntryValue } from '@core/Form/types';
import { GlobalModel } from '@services';

interface UseFieldResetConfig<T> {
  fieldId: string;
  resetState: (value: T) => void;
  updatedInitialValue: T;
}

export const useFieldReset = <T>({
  fieldId,
  resetState,
  updatedInitialValue
}: UseFieldResetConfig<T>) => {
  const { resetFlag, resetRecords, usesStorage } = useFormRoot();

  useUpdateOnlyExtended(() => {
    const fieldPath = fieldId.split('.');

    let resetValue: FormStateEntryValue;

    if (shouldBeReset({ fieldId, resetFlag })) {
      if (usesStorage) {
        resetValue = GlobalModel.getNestedValue(resetRecords[resetFlag.resetKey], fieldPath);
      } else {
        resetValue =
          GlobalModel.getNestedValue(
            resetRecords[resetFlag.resetKey || ROOT_RESET_RECORD_KEY],
            fieldPath
          ) ?? updatedInitialValue;
      }

      resetState(resetValue);
    } else if (resetFlag.resetKey === STORAGE_RESET_KEY) {
      resetValue = GlobalModel.getNestedValue(resetRecords[INITIAL_RESET_RECORD_KEY], fieldPath);

      resetState(resetValue);
    }
  }, [resetFlag]);
};
