import { useCallback } from 'react';

import { useUnmount, useUpdate, useUpdatedRef, useUpdateOnly } from '@services';

import { FormStateEntryValue } from '../../types';

import { useForm } from '../useForm/useForm';

export const useFormParent = ({
  forceValidate,
  name,
  reset,
  valid,
  value
}: {
  forceValidate: () => void;
  name: string;
  reset: () => void;
  valid: boolean;
  value: FormStateEntryValue;
}) => {
  const parentContext = useForm();

  useUpdateOnly(() => {
    forceValidate();
  }, [parentContext.forceValidateFlag]);

  useUpdateOnly(() => {
    reset();
  }, [parentContext.resetFlag]);

  useUpdate(() => {
    parentContext.methods.setInForm({
      key: name,
      valid,
      value
    });
  }, [valid, value]);

  const nameRef = useUpdatedRef(name);

  const clear = useCallback(() => {
    parentContext.methods.removeFromForm({ key: nameRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUnmount(clear);

  const getFieldId = useCallback(() => {
    const parentId = parentContext.methods.getFieldId();

    return parentId ? `${parentId}.${name}` : name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, parentContext.methods.getFieldId]);

  return { getFieldId, parentContext };
};
