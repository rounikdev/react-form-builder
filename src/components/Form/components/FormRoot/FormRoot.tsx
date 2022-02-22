import { FC, memo, useCallback, useMemo, useState } from 'react';

import { useUpdate, useClass } from '@services';

import { FormContextInstance } from '../../context';
import {
  useFormErrors,
  useFormFieldInteraction,
  useFormInteraction,
  useFormReducer,
  useFormReset
} from '../../hooks';
import { FormRootProvider } from '../../providers';
import { FormActions, formObjectReducer } from '../../reducers';
import { buildInitialFormState, flattenFormObjectState } from '../../services';
import { FormContext, FormRootProps, FormStateEntry } from '../../types';

import styles from './FormRoot.scss';

export const FormRoot: FC<FormRootProps> = memo(
  ({
    children,
    className,
    dataTest,
    initialData,
    noValidate = true,
    onChange,
    onReset,
    onSubmit
  }) => {
    const { context, dispatch, removeFromForm, setInForm, valid, value } = useFormReducer({
      flattenState: flattenFormObjectState,
      initialData,
      reducer: formObjectReducer
    });

    const [resetRecords, setResetRecords] = useState<Record<string, FormStateEntry>>({});

    const { errors, registerFieldErrors } = useFormErrors();

    const {
      fieldToBeSet,
      focusedField,
      focusField,
      scrolledField,
      scrollFieldIntoView,
      setFieldValue
    } = useFormFieldInteraction();

    const { forceValidate, forceValidateFlag, reset, resetFlag } = useFormInteraction({
      // TODO: this new instance leads to new instance of `reset` method,
      // which cal lead to infinite loop when using `parentContext.methods`
      // as dependency. Without useCallback the @testing-library/react tests hang
      onReset: useCallback(() => {
        dispatch({
          payload: buildInitialFormState(initialData),
          type: FormActions.SET_FORM_STATE
        });

        if (onReset) {
          onReset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [onReset])
    });

    const getFieldId = useCallback(() => '', []);

    const { cancel, edit, isEdit, save } = useFormReset({ fieldId: getFieldId(), reset });

    useUpdate(() => {
      if (onChange) {
        onChange({ errors, valid, value });
      }
    }, [errors, valid, value]);

    const onSubmitHandler = useCallback(
      (event) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit({ valid, value });
        }
      },
      [onSubmit, valid, value]
    );

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
        resetFlag,
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
      resetFlag,
      scrolledField,
      valid
    ]);

    const rootProviderMethods = useMemo(
      () => ({
        focusField,
        registerFieldErrors,
        scrollFieldIntoView,
        setFieldValue,
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
        initialData,
        methods: rootProviderMethods,
        resetRecords,
        scrolledField
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      errors,
      fieldToBeSet,
      focusedField,
      resetRecords,
      rootProviderMethods,
      scrolledField,
      value
    ]);

    return (
      <FormContextInstance.Provider value={formContext}>
        <FormRootProvider value={formRootContext}>
          <form
            className={useClass([styles.FormRoot, className], [className])}
            data-test={`${dataTest}-form`}
            noValidate={noValidate}
            onSubmit={onSubmitHandler}
          >
            {children}
          </form>
        </FormRootProvider>
      </FormContextInstance.Provider>
    );
  }
);

FormRoot.displayName = 'FormRoot';
