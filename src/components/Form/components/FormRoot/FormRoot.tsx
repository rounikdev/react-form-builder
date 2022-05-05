import { FC, memo, useCallback, useMemo, useState } from 'react';

import { useClass, useUpdate, useUpdateOnly } from '@services';

import { INITIAL_RESET_RECORD_KEY } from '../../constants';
import { FormContextInstance } from '../../context';
import {
  useFormEdit,
  useFormErrors,
  useFormFieldInteraction,
  useFormInteraction,
  useFormReducer
} from '../../hooks';
import { FormEditProvider, FormRootProvider } from '../../providers';
import { formObjectReducer } from '../../reducers';
import { flattenFormObjectState } from '../../services';
import { FormContext, FormRootProps, FormStateEntry, ResetFlag } from '../../types';

import styles from './FormRoot.scss';

export const FormRoot: FC<FormRootProps> = memo(
  ({ children, className, dataTest, noValidate = true, onChange, onReset, onSubmit }) => {
    const { context, removeFromForm, setInForm, valid, value } = useFormReducer({
      flattenState: flattenFormObjectState,
      reducer: formObjectReducer
    });

    const [resetRecords, setResetRecords] = useState<Record<string, FormStateEntry>>({});

    const [rootResetFlag, setRootResetFlag] = useState<ResetFlag>({
      resetKey: INITIAL_RESET_RECORD_KEY
    });

    const [pristine, setPristine] = useState<boolean>(true);

    const setDirty = useCallback(() => setPristine(false), []);

    const { errors, registerFieldErrors } = useFormErrors();

    const {
      fieldToBeSet,
      focusedField,
      focusField,
      scrolledField,
      scrollFieldIntoView,
      setFieldValue
    } = useFormFieldInteraction();

    const reset = useCallback(() => {
      setRootResetFlag({ resetKey: INITIAL_RESET_RECORD_KEY });

      setPristine(true);
    }, []);

    const { forceValidate, forceValidateFlag } = useFormInteraction();

    // Gather the initial state:
    useUpdate(() => {
      if (pristine) {
        setResetRecords((currentResetRecords) => ({
          ...currentResetRecords,
          [INITIAL_RESET_RECORD_KEY]: value
        }));
      }
    }, [value]);

    const getFieldId = useCallback(() => '', []);

    const { cancel, edit, isEdit, save } = useFormEdit({
      fieldId: 'root',
      formData: value,
      pristine,
      setResetFlag: setRootResetFlag,
      setResetRecords
    });

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
        setResetRecords,
        setResetFlag: setRootResetFlag
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
        resetFlag: rootResetFlag,
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
      rootResetFlag,
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
