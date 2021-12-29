import {
  createContext,
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState
} from 'react';

import { useClass, useUpdate, useUpdateOnly, useUpdatedRef, useUnmount } from '@services';

import { FormDataProvider } from './FormDataProvider';
import { reducer } from './reducer';
import {
  FieldErrors,
  FieldErrorsPayload,
  ForceValidateFlag,
  FormActions,
  FormContext,
  FormProps,
  FormRemoveArguments,
  FormSetPayload,
  FormStateEntry,
  ResetFlag
} from './types';

import styles from './Form.scss';

const initialContextState: FormContext = {
  forceValidateFlag: {},
  methods: {
    forceValidate: () => {},
    getFieldId: () => '',
    registerFieldErrors: undefined,
    removeFromForm: () => {},
    reset: () => {},
    setInForm: () => {}
  },
  resetFlag: {},
  state: {},
  valid: false
};

export const initialFormContextState = initialContextState;

const Context = createContext(initialContextState);

export const useForm = (): FormContext => {
  return useContext(Context);
};

export const Form: FC<FormProps> = memo(
  ({
    children,
    className,
    dataTest,
    formTag,
    name = '',
    noValidate = true,
    onChange,
    onReset,
    onSubmit,
    type = 'object'
  }) => {
    const [context, dispatch] = useReducer(reducer, initialContextState);

    const [errors, setErrors] = useState<FieldErrors>({});

    const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

    const [resetFlag, setResetFlag] = useState<ResetFlag>({});

    const parentContext = useForm();

    const forceValidate = useCallback(() => {
      setForceValidateFlag({});
    }, []);

    const reset = useCallback(() => {
      setResetFlag({});

      if (onReset) {
        onReset();
      }
    }, [onReset]);

    useUpdateOnly(() => {
      forceValidate();
    }, [parentContext.forceValidateFlag]);

    useUpdateOnly(() => {
      reset();
    }, [parentContext.resetFlag]);

    // Update the parent Form state:
    useUpdate(() => {
      let data: FormStateEntry;

      switch (type) {
        case 'object':
          data = Object.entries(context.state).reduce(
            (obj, [k, v]) => {
              return {
                valid: obj.valid && v.valid,
                value: { ...obj.value, [k]: v.value }
              };
            },
            {
              valid: true as boolean,
              value: {}
            }
          );
          break;
        default:
          data = Object.entries(context.state).reduce(
            (obj, _, index) => {
              const currentValue = context.state[index].value;
              const currentValid = context.state[index].valid;

              return {
                valid: obj.valid && currentValid,
                value: [...obj.value, currentValue]
              };
            },
            {
              valid: true as boolean,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value: [] as any[]
            }
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

    useUnmount(clear);

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
      return Object.entries(context.state).reduce(
        (obj, [k, v]) => {
          return {
            valid: obj.valid && v.valid,
            value: { ...obj.value, [k]: v.value }
          };
        },
        { valid: true, value: {} as FormStateEntry }
      );
    }, [context.state]);

    const onSubmitHandler = useCallback(
      (event) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit({ valid, value: formData });
        } else {
          console.warn('onSubmit prop nit provided');
        }
      },
      [formData, onSubmit, valid]
    );

    const methods = useMemo(
      () => ({
        forceValidate,
        getFieldId,
        registerFieldErrors: formTag
          ? registerFieldErrors
          : parentContext.methods.registerFieldErrors,
        removeFromForm,
        reset,
        setInForm
      }),
      [
        forceValidate,
        formTag,
        getFieldId,
        parentContext.methods.registerFieldErrors,
        registerFieldErrors,
        removeFromForm,
        reset,
        setInForm
      ]
    );

    const formContext = useMemo<FormContext>(
      () => ({
        ...context,
        forceValidateFlag,
        resetFlag,
        methods,
        valid
      }),
      [context, forceValidateFlag, methods, resetFlag, valid]
    );

    const formDataContext = useMemo(
      () => ({
        errors,
        formData
      }),
      [errors, formData]
    );

    useUpdate(() => {
      if (onChange) {
        onChange({ errors, valid, value: formData });
      }
    }, [errors, formData, valid]);

    const formClassNames = useClass([styles.Container, className], [className]);

    return formTag ? (
      <Context.Provider value={formContext}>
        <FormDataProvider value={formDataContext}>
          <form
            className={formClassNames}
            data-test={dataTest}
            noValidate={noValidate}
            onSubmit={onSubmitHandler}
          >
            {children}
          </form>
        </FormDataProvider>
      </Context.Provider>
    ) : (
      <Context.Provider value={formContext}>{children}</Context.Provider>
    );
  }
);

Form.displayName = 'Form';
