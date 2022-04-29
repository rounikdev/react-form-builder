import { useCallback, useState } from 'react';

import { GlobalModel, useUpdateOnly } from '@services';

import { useFormEditContext, useFormRoot } from '../../providers';
import { FormStateEntryValue, ResetFlag } from '../../types';

export const useFormArray = ({
  factory,
  fieldId,
  initialValue = [],
  resetFlag
}: {
  factory: () => FormStateEntryValue;
  fieldId: string;
  initialValue?: unknown[];
  resetFlag: ResetFlag;
}) => {
  const {
    formData: providedFormData,
    methods: { setDirty },
    pristine,
    resetRecords
  } = useFormRoot();

  const { isEdit } = useFormEditContext();

  const getInitialValue = useCallback(() => {
    const fieldPath = fieldId.split('.');

    const resetRecordsKey =
      Object.keys(resetRecords).find((key) => fieldId.indexOf(key) === 0) || '';

    const valueFromResetRecords = GlobalModel.getNestedValue(
      resetRecords[resetRecordsKey],
      fieldPath
    );
    const valueFromFormData = GlobalModel.getNestedValue(providedFormData, fieldPath);

    const nonEditValue = pristine ? initialValue : valueFromResetRecords ?? valueFromFormData;

    // If editing nested form, read from form data
    // (get blank instances when adding to arrays,
    // clear nested conditional fields).
    // If on root level form, if pristine, read initial state,
    // else check if has reset data or fallback to the
    // form data.
    return (isEdit ? valueFromFormData : nonEditValue) || [];
  }, [fieldId, initialValue, isEdit, pristine, providedFormData, resetRecords]);

  const [list, setList] = useState<FormStateEntryValue[]>(getInitialValue());

  const add = useCallback(() => {
    setDirty();
    setList((currentList) => (factory ? [...currentList, factory()] : currentList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factory]);

  const remove = useCallback((index: number) => {
    setDirty();
    setList((currentState) => currentState.filter((_, i) => i !== index));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdateOnly(() => {
    setList(getInitialValue());
  }, [resetFlag]);

  useUpdateOnly(() => {
    if (!isEdit) {
      setList(getInitialValue());
    }
  }, [isEdit]);

  return { add, list, remove };
};
