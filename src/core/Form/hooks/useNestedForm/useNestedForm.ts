import { useCallback, useMemo, useState } from 'react';

import {
  useUnmountSafe,
  useUpdate,
  useUpdatedRef,
  useUpdateExtended,
  useUpdateOnlyExtended
} from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks/useForm/useForm';
import { useFormEditContext, useFormRoot } from '@core/Form/providers';
import { shouldBeReset } from '@core/Form/services';
import {
  DependencyExtractor,
  ForceValidateFlag,
  ForceValidateMethod,
  FormStateEntry,
  FormStateEntryValue,
  ValidationError,
  Validator,
  ValidityCheck
} from '@core/Form/types';

interface UseNestedFormArgs<T> {
  dependencyExtractor?: DependencyExtractor;
  name: string;
  valid: boolean;
  validator?: Validator<T[]>;
  value: FormStateEntryValue;
}

export const useNestedForm = <T>({
  dependencyExtractor,
  name,
  valid,
  validator,
  value
}: UseNestedFormArgs<T>) => {
  const {
    formData,
    methods: { registerFieldErrors, setResetFlag, setResetRecords },
    resetFlag
  } = useFormRoot();

  const parentContext = useForm();

  const { isEdit: isParentEdit } = useFormEditContext();

  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag | null>(null);

  const [isEdit, setIsEdit] = useState(false);

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const [focused, setFocused] = useState(false);

  const [touched, setTouched] = useState(false);

  const [nestedIsValid, setNestedIsValid] = useState(false);

  const formDataRef = useUpdatedRef(formData);

  const nameRef = useUpdatedRef(name);

  const dependency = useMemo(() => {
    if (typeof dependencyExtractor === 'function' && formData) {
      return dependencyExtractor(formData);
    } else {
      return undefined;
    }
  }, [dependencyExtractor, formData]);

  const forceValidate: ForceValidateMethod = useCallback(
    (customForceValidateFlag = {}) => setForceValidateFlag(customForceValidateFlag),
    []
  );

  const getFieldId = useCallback(() => {
    const parentId = parentContext.methods.getFieldId();

    return parentId ? `${parentId}.${name}` : name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, parentContext.methods.getFieldId]);

  const reset = useCallback(() => {
    setResetFlag({ resetKey: getFieldId() });
    setTouched(false);
  }, [getFieldId, setResetFlag]);

  const clear = useCallback(() => {
    parentContext.methods.removeFromForm({ key: nameRef.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanFromResetState = useCallback(() => {
    setResetRecords((currentResetRecords) => {
      const newResetRecords = { ...currentResetRecords };

      delete newResetRecords[getFieldId()];

      return newResetRecords;
    });
  }, [getFieldId, setResetRecords]);

  const cancelWithoutReset = useCallback(() => {
    setIsEdit(false);

    // Timeout keeps the state enough time,
    // so the nested fields to be able to
    // read their values from it:
    setTimeout(cleanFromResetState);
  }, [cleanFromResetState]);

  const cancel = useCallback(() => {
    setIsEdit(false);

    reset();

    // Timeout keeps the state enough time,
    // so the nested fields to be able to
    // read their values from it:
    setTimeout(cleanFromResetState);
  }, [cleanFromResetState, reset]);

  const edit = useCallback(() => {
    setIsEdit(true);

    setResetRecords((currentResetRecords) => {
      return {
        ...currentResetRecords,
        // Using just formData makes Form test hang:
        [getFieldId()]: formDataRef.current as unknown as FormStateEntry
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFieldId, setResetRecords]);

  const save = useCallback(() => {
    setIsEdit(false);

    cleanFromResetState();
  }, [cleanFromResetState]);

  const blurParent = useCallback(() => {
    setFocused(false);
  }, []);

  const focusParent = useCallback(() => {
    setFocused(true);
  }, []);

  const touchParent = useCallback(() => {
    setTouched(true);
  }, []);

  useUpdateExtended(
    async () => {
      let validityCheck: ValidityCheck;

      if (validator) {
        parentContext.methods.setInForm({
          key: name,
          valid: false,
          value
        });

        try {
          validityCheck = await validator(value, dependency);
        } catch (error) {
          validityCheck = {
            errors: [{ text: 'errorValidating' }],
            valid: false
          };
        }
      } else {
        validityCheck = {
          errors: [],
          valid: true
        };
      }

      setErrors(validityCheck.errors);

      setNestedIsValid(validityCheck.valid);

      parentContext.methods.setInForm({
        key: name,
        valid: valid && validityCheck.valid,
        value
      });
    },
    // !This is very important!!!!
    [dependency, value, valid],
    true
  );

  // Update form errors state on errors update:
  useUpdate(() => {
    if (registerFieldErrors) {
      registerFieldErrors({ fieldErrors: errors, fieldId: getFieldId() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, getFieldId]);

  // Remove from form errors state on unmount:
  useUpdate(() => {
    return () => {
      if (registerFieldErrors) {
        registerFieldErrors({ fieldErrors: [], fieldId: getFieldId() });
      }
    };
  }, [getFieldId]);

  useUpdate(() => {
    if (focused) {
      parentContext.methods.focusParent();
    } else {
      parentContext.methods.blurParent();
    }
  }, [focused]);

  useUpdateOnlyExtended(() => {
    const fieldId = getFieldId();

    if (
      parentContext.forceValidateFlag &&
      Object.keys(parentContext.forceValidateFlag).length === 0
    ) {
      setTouched(true);
    } else if (
      parentContext.forceValidateFlag &&
      typeof parentContext.forceValidateFlag[fieldId] === 'boolean'
    ) {
      setTouched(parentContext.forceValidateFlag[fieldId]);
    }
  }, [parentContext.forceValidateFlag]);

  useUpdateOnlyExtended(() => {
    if (parentContext.forceValidateFlag) {
      forceValidate(parentContext.forceValidateFlag);
    }
  }, [parentContext.forceValidateFlag]);

  /**
   * For UX/UI purpose.
   * Close nested forms on closing
   * the parent one:
   */
  useUpdateOnlyExtended(() => {
    if (!isParentEdit && isEdit) {
      // Because the reset has already
      // been triggered from it's parent:
      cancelWithoutReset();
    }
  }, [isParentEdit]);

  useUpdateOnlyExtended(() => {
    if (touched) {
      parentContext.methods.touchParent();
    }
  }, [touched]);

  useUpdateOnlyExtended(() => {
    if (shouldBeReset({ fieldId: getFieldId(), resetFlag })) {
      setTouched(false);
    }
  }, [resetFlag]);

  useUnmountSafe(clear);

  return {
    blurParent,
    cancel,
    edit,
    errors,
    focused,
    focusParent,
    forceValidate,
    forceValidateFlag,
    getFieldId,
    isEdit,
    isParentEdit,
    nestedIsValid,
    reset,
    save,
    touched,
    touchParent
  };
};
