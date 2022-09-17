import { useEffect } from 'react';

import { useUnmount, useUpdateOnly } from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks/useForm/useForm';

interface UseFieldParentConfig<T> {
  fieldId: string;
  name: string;
  setTouch: (touched: boolean) => void;
  valid: boolean;
  value: T;
}

export const useFieldParent = <T>({
  fieldId,
  name,
  setTouch,
  valid,
  value
}: UseFieldParentConfig<T>) => {
  const {
    forceValidateFlag,
    methods: { removeFromForm, setInForm }
  } = useForm();

  useUnmount(() => {
    // No need to call setDirty, because a field could be
    // unmounted because removal form array, which calls
    // setDirty or from conditional field change, which
    // might have happened because some form state update
    // which calls setDirty:
    removeFromForm({ key: name });
  });

  // Update parent Form state:
  useEffect(() => {
    setInForm({
      key: name,
      valid,
      value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, valid, value]);

  // TODO StrictMode check!
  useUpdateOnly(() => {
    if (Object.keys(forceValidateFlag).length === 0) {
      setTouch(true);
    } else if (typeof forceValidateFlag[fieldId] === 'boolean') {
      setTouch(forceValidateFlag[fieldId]);
    }
  }, [forceValidateFlag]);
};
