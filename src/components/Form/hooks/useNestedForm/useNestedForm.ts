import { useCallback, useState } from 'react';

import { useUnmount, useUpdate, useUpdatedRef, useUpdateOnly } from '@services';

import { useFormEditContext, useFormRoot } from '../../providers';
import { ForceValidateFlag, FormStateEntryValue } from '../../types';
import { useForm } from '../useForm/useForm';

interface UseNestedFormArgs {
  name: string;
  onReset?: () => void;
  valid: boolean;
  value: FormStateEntryValue;
}

export const useNestedForm = ({ name, onReset, valid, value }: UseNestedFormArgs) => {
  const {
    formData,
    methods: { setResetFlag: setRootResetFlag, setResetRecords }
  } = useFormRoot();

  const parentContext = useForm();

  const { isEdit: isParentEdit } = useFormEditContext();

  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

  const [isEdit, setIsEdit] = useState(false);

  const nameRef = useUpdatedRef(name);

  const forceValidate = useCallback(() => {
    setForceValidateFlag({});
  }, []);

  const getFieldId = useCallback(() => {
    const parentId = parentContext.methods.getFieldId();

    return parentId ? `${parentId}.${name}` : name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, parentContext.methods.getFieldId]);

  // TODO: Fix the nested reset issue
  const reset = useCallback(() => {
    setRootResetFlag({ resetKey: getFieldId() });

    if (onReset) {
      onReset();
    }
  }, [getFieldId, onReset, setRootResetFlag]);

  const clear = useCallback(() => {
    parentContext.methods.removeFromForm({ key: nameRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelWithoutReset = useCallback(() => {
    setIsEdit(false);

    setTimeout(() => {
      setResetRecords((currentResetRecords) => {
        const newResetRecords = { ...currentResetRecords };
        delete newResetRecords[getFieldId()];
        return newResetRecords;
      });
    });
  }, [getFieldId, setResetRecords]);

  const cancel = useCallback(() => {
    setIsEdit(false);

    reset();

    setTimeout(() => {
      setResetRecords((currentResetRecords) => {
        const newResetRecords = { ...currentResetRecords };
        delete newResetRecords[getFieldId()];
        return newResetRecords;
      });
    });
  }, [getFieldId, reset, setResetRecords]);

  const formDataRef = useUpdatedRef(formData);

  const edit = useCallback(() => {
    setIsEdit(true);

    setResetRecords((currentResetRecords) => {
      return {
        ...currentResetRecords,
        [getFieldId()]: formDataRef.current
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFieldId, setResetRecords]); // formData makes Form test hang

  const save = useCallback(() => {
    setIsEdit(false);

    setResetRecords((currentResetRecords) => {
      const newResetRecords = { ...currentResetRecords };
      delete newResetRecords[getFieldId()];
      return newResetRecords;
    });
  }, [getFieldId, setResetRecords]);

  useUpdateOnly(() => {
    forceValidate();
  }, [parentContext.forceValidateFlag]);

  useUpdate(() => {
    parentContext.methods.setInForm({
      key: name,
      valid,
      value
    });
  }, [valid, value]);

  useUpdateOnly(() => {
    if (!isParentEdit && isEdit) {
      cancelWithoutReset();
    }
  }, [isParentEdit]);

  useUnmount(clear);

  return {
    cancel,
    edit,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    isEdit,
    isParentEdit,
    reset,
    save
  };
};
