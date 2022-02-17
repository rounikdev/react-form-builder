import { useCallback, useState } from 'react';

import { GlobalModel, useUpdate } from '@services';

import { useFormRoot } from '../../providers';
import { FormStateEntryValue, ResetFlag } from '../../types';

export const useFormArray = ({
  factory,
  fieldId,
  resetFlag
}: {
  factory: () => FormStateEntryValue;
  fieldId: string;
  resetFlag: ResetFlag;
}) => {
  const { formData: providedFormData } = useFormRoot();

  const [list, setList] = useState<FormStateEntryValue[]>(
    GlobalModel.getNestedValue(providedFormData, fieldId.split('.')) || []
  );

  const add = useCallback(
    () => setList((currentList) => (factory ? [...currentList, factory()] : currentList)),
    [factory]
  );

  const remove = useCallback(
    (index: number) => setList((currentState) => currentState.filter((_, i) => i !== index)),
    []
  );

  useUpdate(
    () => setList(GlobalModel.getNestedValue(providedFormData, fieldId.split('.')) || []),
    [resetFlag]
  );

  return { add, list, remove };
};
