import { FC, memo, useCallback, useMemo } from 'react';

import { useUpdate, useClass } from '@services';

import { FormContextInstance } from '../../context';
import {
  useFormErrors,
  useFormFieldInteraction,
  useFormInteraction,
  useFormReducer
} from '../../hooks';
import { FormRootProvider } from '../../providers';
import { FormActions, formObjectReducer } from '../../reducers';
import { buildInitialFormState, flattenFormObjectState } from '../../services';
import { FormContext, FormRootProps } from '../../types';

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
      reducer: formObjectReducer,
      type: 'object'
    });

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
      // as dependency
      onReset: () => {
        dispatch({
          payload: buildInitialFormState(initialData),
          type: FormActions.SET_FORM_STATE
        });

        if (onReset) {
          onReset();
        }
      }
    });

    const getFieldId = useCallback(() => '', []);

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
        focusField,
        forceValidate,
        getFieldId,
        registerFieldErrors,
        removeFromForm,
        reset,
        scrollFieldIntoView,
        setFieldValue,
        setInForm
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reset]
    );

    const formContext = useMemo<FormContext>(() => {
      return {
        ...context,
        fieldToBeSet,
        focusedField,
        forceValidateFlag,
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
        setFieldValue
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
        scrolledField
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors, fieldToBeSet, focusedField, rootProviderMethods, scrolledField, value]);

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
