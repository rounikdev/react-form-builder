import { FC, memo, useCallback, useMemo } from 'react';

import { useClass, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { FormContextInstance } from '@core/Form/context';
import { useFormReducer, useRootForm } from '@core/Form/hooks';
import { FormEditProvider, FormRootProvider } from '@core/Form/providers';
import { formObjectReducer } from '@core/Form/reducers';
import { flattenFormObjectState } from '@core/Form/services';
import { FormContext, FormRootProps } from '@core/Form/types';

import styles from './FormRoot.scss';

export const FormRoot: FC<FormRootProps> = memo(
  ({ children, className, dataTest, noValidate = true, onChange, onReset, onSubmit }) => {
    const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
      flattenState: flattenFormObjectState,
      reducer: formObjectReducer
    });

    const {
      cancel,
      edit,
      errors,
      fieldToBeSet,
      focusedField,
      focusField,
      forceValidate,
      forceValidateFlag,
      getFieldId,
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
      setFieldValue,
      setResetFlag,
      setResetRecords
    } = useRootForm({
      formData: value
    });

    const onSubmitHandler = useCallback(
      (event) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit({ valid, value });
        }
      },
      [onSubmit, valid, value]
    );

    useUpdate(() => {
      if (onChange) {
        onChange({ errors, valid, value });
      }
    }, [errors, valid, value]);

    useUpdateOnly(() => {
      if (pristine && onReset) {
        onReset();
      }
    }, [pristine]);

    const methods = useMemo(
      () => ({
        cancel,
        edit,
        focusField,
        forceValidate,
        getFieldId,
        registerFieldErrors,
        removeFromForm,
        reset,
        save,
        scrollFieldIntoView,
        setFieldValue,
        setInForm
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [cancel, edit, save, reset]
    );

    const formContext = useMemo<FormContext>(() => {
      return {
        ...context,
        fieldToBeSet,
        focusedField,
        forceValidateFlag,
        isEdit,
        methods,
        scrolledField,
        valid
      };
    }, [
      context,
      fieldToBeSet,
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
        registerFieldErrors,
        scrollFieldIntoView,
        setDirty,
        setFieldValue,
        setResetFlag,
        setResetRecords
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const formRootContext = useMemo(() => {
      return {
        errors,
        fieldToBeSet,
        focusedField,
        formData: value,
        methods: rootProviderMethods,
        pristine,
        resetFlag,
        resetRecords,
        scrolledField
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      errors,
      fieldToBeSet,
      focusedField,
      pristine,
      resetRecords,
      rootProviderMethods,
      resetFlag,
      scrolledField,
      value
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
