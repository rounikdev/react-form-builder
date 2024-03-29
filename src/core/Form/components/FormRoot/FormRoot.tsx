import { FC, FormEvent, memo, useCallback, useMemo } from 'react';

import { useClass, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { INITIAL_RESET_RECORD_KEY, NO_RESET_KEY, STORAGE_RESET_KEY } from '@core/Form/constants';
import { FormContextInstance } from '@core/Form/context';
import { useFormReducer, useRootForm } from '@core/Form/hooks';
import { FormEditProvider, FormRootProvider } from '@core/Form/providers';
import { formObjectReducer } from '@core/Form/reducers';
import { flattenFormObjectState } from '@core/Form/services';
import { FormContext, FormRootProps } from '@core/Form/types';

import styles from './FormRoot.scss';

const defaultTouchParent = () => {};

export const FormRoot: FC<FormRootProps> = memo(
  ({
    children,
    className,
    dataTest,
    initialResetState,
    noValidate = true,
    onChange,
    onReset,
    onSubmit,
    usesStorage
  }) => {
    const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
      flattenState: flattenFormObjectState,
      reducer: formObjectReducer
    });

    const {
      cancel,
      edit,
      errors,
      fieldsToBeSet,
      focusedField,
      focusField,
      forceValidate,
      forceValidateFlag,
      getFieldId,
      injectedErrors,
      injectErrors,
      isEdit,
      pristine,
      registerFieldErrors,
      reset,
      resetFlag,
      resetRecords,
      save,
      scrolledField,
      scrollFieldIntoView,
      setDirty,
      setFieldsValue,
      setResetFlag,
      setResetRecords
    } = useRootForm({
      formData: value,
      initialResetState,
      usesStorage
    });

    useUpdate(() => {
      if (!pristine && onChange) {
        onChange({
          errors,
          pristine,
          resetState: resetRecords[INITIAL_RESET_RECORD_KEY],
          valid,
          value
        });
      }
    }, [errors, pristine, valid, value]);

    // This will sync the errors
    // and valid after reset:
    useUpdate(
      () => {
        if (
          resetFlag.resetKey === INITIAL_RESET_RECORD_KEY ||
          resetFlag.resetKey === STORAGE_RESET_KEY ||
          resetFlag.resetKey === NO_RESET_KEY // This prevents StrictMode breaking the behavior
        ) {
          if (pristine && onChange && usesStorage) {
            onChange({
              errors,
              pristine,
              resetState: null,
              valid,
              value
            });
          }
        }
      },
      [resetFlag, errors, valid],
      true
    );

    useUpdateOnly(() => {
      if (
        onReset &&
        (resetFlag.resetKey === INITIAL_RESET_RECORD_KEY ||
          resetFlag.resetKey === STORAGE_RESET_KEY)
      ) {
        onReset();
      }
    }, [resetFlag]);

    const methods = useMemo(
      () => ({
        blurParent: defaultTouchParent,
        cancel,
        edit,
        focusField,
        focusParent: defaultTouchParent,
        forceValidate,
        getFieldId,
        registerFieldErrors,
        removeFromForm,
        reset,
        save,
        scrollFieldIntoView,
        setFieldsValue,
        setInForm,
        touchParent: defaultTouchParent
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [cancel, edit, save, reset]
    );

    const formContext = useMemo<FormContext>(() => {
      return {
        ...context,
        fieldsToBeSet,
        focused: false,
        focusedField,
        forceValidateFlag,
        isEdit,
        methods,
        scrolledField,
        valid
      };
    }, [
      context,
      fieldsToBeSet,
      focusedField,
      forceValidateFlag,
      isEdit,
      methods,
      scrolledField,
      valid
    ]);

    const rootProviderMethods = useMemo(
      () => ({
        focusField,
        forceValidate,
        injectErrors,
        registerFieldErrors,
        reset,
        scrollFieldIntoView,
        setDirty,
        setFieldsValue,
        setResetFlag,
        setResetRecords
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const onSubmitHandler = useCallback(
      (event: FormEvent) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit({ formState: { valid, value }, rootMethods: rootProviderMethods });
        }
      },
      [onSubmit, rootProviderMethods, valid, value]
    );

    const formRootContext = useMemo(() => {
      return {
        errors,
        fieldsToBeSet,
        focusedField,
        formData: value,
        injectedErrors,
        methods: rootProviderMethods,
        pristine,
        resetFlag,
        resetRecords,
        scrolledField,
        usesStorage
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      errors,
      fieldsToBeSet,
      focusedField,
      injectedErrors,
      pristine,
      resetRecords,
      rootProviderMethods,
      resetFlag,
      scrolledField,
      value,
      usesStorage
    ]);

    return (
      <FormEditProvider isEdit={isEdit}>
        <FormContextInstance.Provider value={formContext}>
          <FormRootProvider value={formRootContext}>
            <form
              className={useClass([styles.FormRoot, className], [className])}
              data-pristine={pristine}
              data-test={`${dataTest}-form`}
              noValidate={noValidate}
              onSubmit={onSubmitHandler}
            >
              {children}
            </form>
          </FormRootProvider>
        </FormContextInstance.Provider>
      </FormEditProvider>
    );
  }
);

FormRoot.displayName = 'FormRoot';
