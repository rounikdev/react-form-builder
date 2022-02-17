import { FC, memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import { GlobalModel, useUpdate, useUpdateOnly, useUpdatedRef, useClass } from '@services';

import { FormContextInstance, initialFormContext } from './context';
import { FormArrayWrapper } from './FormArrayWrapper';
import { FormRootProvider, useFormRoot } from './providers';
import { useForm } from './hooks';
import { FormActions, reducer } from './reducers';
import { buildInitialFormState, flattenFormState } from './services';
import {
  FieldErrors,
  FieldErrorsPayload,
  ForceValidateFlag,
  FormContext,
  FormProps,
  FormRemoveArguments,
  FormSetPayload,
  FormStateEntry,
  ResetFlag,
  SetFieldValuePayload
} from './types';

import styles from './Form.scss';

export const Form: FC<FormProps> = memo(
  ({
    children,
    className,
    dataTest,
    factory,
    formTag,
    initialData,
    name = '',
    noValidate = true,
    onChange,
    onReset,
    onSubmit,
    type = 'object'
  }) => {
    const [context, dispatch] = useReducer(reducer, {
      ...initialFormContext,
      state: buildInitialFormState(initialData)
    });

    const { formData: providedFormData } = useFormRoot();

    const [errors, setErrors] = useState<FieldErrors>({});

    const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

    const [resetFlag, setResetFlag] = useState<ResetFlag>({});

    const [focusedField, focusField] = useState('');

    const [scrolledField, scrollFieldIntoView] = useState('');

    const [fieldToBeSet, setFieldValue] = useState<SetFieldValuePayload>({
      id: '',
      value: undefined
    });

    const parentContext = useForm();

    const forceValidate = useCallback(() => {
      setForceValidateFlag({});
    }, []);

    const reset = useCallback(() => {
      setResetFlag({});

      if (formTag) {
        dispatch({
          payload: buildInitialFormState(initialData),
          type: FormActions.SET_FORM_STATE
        });
      }

      if (onReset) {
        onReset();
      }
    }, [formTag, initialData, onReset]);

    useUpdateOnly(() => {
      forceValidate();
    }, [parentContext.forceValidateFlag]);

    useUpdateOnly(() => {
      reset();
    }, [parentContext.resetFlag]);

    // Update the parent Form state:
    useEffect(() => {
      let data: FormStateEntry;

      switch (type) {
        case 'object':
          data = Object.entries(context.state).reduce(flattenFormState, {
            valid: true,
            value: {}
          });
          break;
        default:
          data = Object.entries(context.state).reduce(
            (obj, _, index) => {
              const currentValue = context.state[index].value;
              const currentValid = context.state[index].valid;
              return {
                value: [...obj.value, currentValue],
                valid: obj.valid && currentValid
              };
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { valid: true as boolean, value: [] as any[] }
          );
          break;
      }

      parentContext.methods.setInForm({
        key: name,
        ...data
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.state]);

    const nameRef = useUpdatedRef(name);

    const clear = useCallback(() => {
      parentContext.methods.removeFromForm({ key: nameRef.current });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => clear, [clear]);

    const getFieldId = useCallback(() => {
      const parentId = parentContext.methods.getFieldId();

      return parentId ? `${parentId}.${name}` : name;
    }, [name, parentContext.methods]);

    const registerFieldErrors = useCallback(({ fieldErrors, fieldId }: FieldErrorsPayload) => {
      setErrors((currentErrors) => {
        if (fieldErrors.length === 0) {
          const newErrors = { ...currentErrors };

          delete newErrors[fieldId];
          return newErrors;
        }
        return {
          ...currentErrors,
          [fieldId]: fieldErrors
        };
      });
    }, []);

    const removeFromForm = useCallback(
      (payload: FormRemoveArguments) => {
        dispatch({
          payload: {
            ...payload,
            type
          },
          type: FormActions.REMOVE_FROM_FORM
        });
      },
      [type]
    );

    const setInForm = useCallback((payload: FormSetPayload) => {
      dispatch({
        payload,
        type: FormActions.SET_IN_FORM
      });
    }, []);

    const { value: formData, valid } = useMemo(() => {
      return Object.entries(context.state).reduce(flattenFormState, {
        valid: true,
        value: {}
      });
    }, [context.state]);

    const onSubmitHandler = useCallback(
      (event) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit({ valid, value: formData });
        } else {
          console.warn('onSubmit prop not provided');
        }
      },
      [formData, onSubmit, valid]
    );

    const methods = useMemo(
      () => ({
        focusField: formTag ? focusField : parentContext.methods.focusField,
        forceValidate,
        getFieldId,
        registerFieldErrors: formTag
          ? registerFieldErrors
          : parentContext.methods.registerFieldErrors,
        removeFromForm,
        reset,
        scrollFieldIntoView: formTag
          ? scrollFieldIntoView
          : parentContext.methods.scrollFieldIntoView,
        setFieldValue: formTag ? setFieldValue : parentContext.methods.setFieldValue,
        setInForm
      }),
      [
        focusField,
        forceValidate,
        formTag,
        getFieldId,
        parentContext.methods.focusField,
        parentContext.methods.registerFieldErrors,
        parentContext.methods.scrollFieldIntoView,
        parentContext.methods.setFieldValue,
        registerFieldErrors,
        removeFromForm,
        reset,
        scrollFieldIntoView,
        setInForm
      ]
    );

    const formContext = useMemo<FormContext>(() => {
      return {
        ...context,
        fieldToBeSet: formTag ? fieldToBeSet : parentContext.fieldToBeSet,
        focusedField: formTag ? focusedField : parentContext.focusedField,
        forceValidateFlag,
        methods,
        resetFlag,
        scrolledField: formTag ? scrolledField : parentContext.scrolledField,
        valid
      };
    }, [
      context,
      fieldToBeSet,
      focusedField,
      forceValidateFlag,
      formTag,
      methods,
      parentContext.fieldToBeSet,
      parentContext.focusedField,
      parentContext.scrolledField,
      resetFlag,
      scrolledField,
      valid
    ]);

    const formDataContext = useMemo(() => {
      return {
        errors,
        formData,
        initialData
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors, formData]);

    useUpdate(() => {
      if (onChange) {
        onChange({ errors, valid, value: formData });
      }
    }, [errors, formData, valid]);

    const formClassNames = useClass([styles.Form, className], [className]);

    if (formTag) {
      return (
        <FormContextInstance.Provider value={formContext}>
          <FormRootProvider value={formDataContext}>
            <form
              className={formClassNames}
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

    if (type === 'array') {
      return (
        <FormContextInstance.Provider value={formContext}>
          <FormArrayWrapper
            factory={factory}
            initialValue={GlobalModel.getNestedValue(providedFormData, getFieldId().split('.'))}
            resetFlag={resetFlag}
          >
            {children}
          </FormArrayWrapper>
        </FormContextInstance.Provider>
      );
    }

    return (
      <FormContextInstance.Provider value={formContext}>{children}</FormContextInstance.Provider>
    );
  }
);

Form.displayName = 'Form';
