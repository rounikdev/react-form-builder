import { FocusEventHandler, MutableRefObject, ReactNode } from 'react';

import { Animatable, Disableable, Stylable, Testable } from '../../../types';

import { TranslationSubstitute } from '../../Translation/types';

export interface Field<T> extends UseFieldConfig<T>, Disableable, Stylable, Testable {
  expandError?: boolean;
  hidden?: boolean;
  hideRequiredLabel?: boolean;
  id: string;
  label?: string;
  noLabelTruncate?: boolean;
  placeholder?: string;
  required?: boolean;
  requiredLabel?: string;
  showOptionalLabel?: boolean;
}

export type FormType = 'array' | 'object';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormStateEntryValue = any | any[];

export interface FormSetPayload {
  key: string;
  valid: boolean;
  value: FormStateEntryValue;
}

export interface FormSetAction {
  payload: FormSetPayload;
  type: 'SET_IN_FORM';
}

export interface FormRemoveArguments {
  key: string;
}

export interface FormRemovePayload extends FormRemoveArguments {
  type: string;
}

export interface FormRemoveAction {
  payload: FormRemovePayload;
  type: 'REMOVE_FROM_FORM';
}

export interface FormSetStateAction {
  payload: FormState;
  type: 'SET_FORM_STATE';
}

export type FormContextReducer = (
  context: FormContext,
  action: FormSetAction | FormRemoveAction | FormSetStateAction
) => FormContext;

export interface FormStateEntry {
  valid: boolean;
  value: FormStateEntryValue;
}

export interface FormState {
  [key: string]: FormStateEntry;
}

export type ForceValidateFlag = Record<string, unknown>;

export type ResetFlag = Record<string, unknown>;

export interface FieldErrorsPayload {
  fieldErrors: ValidationError[];
  fieldId: string;
}

export interface SetFieldValuePayload {
  id: string;
  value?: FormStateEntryValue;
}

export interface FormContext {
  fieldToBeSet: SetFieldValuePayload;
  focusedField: string;
  forceValidateFlag: ForceValidateFlag;
  methods: {
    focusField: (fieldId: string) => void;
    forceValidate: () => void;
    getFieldId: () => string;
    registerFieldErrors?: (payload: FieldErrorsPayload) => void;
    removeFromForm: (payload: FormRemoveArguments) => void;
    reset: () => void;
    scrollFieldIntoView: (fieldId: string) => void;
    setFieldValue: (payload: SetFieldValuePayload) => void;
    setInForm: (payload: FormSetPayload) => void;
  };
  resetFlag: ResetFlag;
  scrolledField: string;
  state: FormState;
  valid: boolean;
}

export interface FieldErrors {
  [key: string]: ValidationError[];
}

export interface FormProps {
  className?: string;
  dataTest?: string;
  factory?: () => FormStateEntryValue;
  formTag?: boolean;
  initialData?: FormStateEntryValue;
  name?: string;
  noValidate?: boolean;
  onChange?: (formState: {
    errors: FieldErrors;
    valid: boolean;
    value: FormStateEntryValue;
  }) => void;
  onReset?: () => void;
  onSubmit?: (formState: FormStateEntry) => void;
  type?: FormType;
}

export interface FormRootProps extends Testable {
  className?: string;
  initialData?: FormStateEntryValue;
  noValidate?: boolean;
  onChange?: (formState: {
    errors: FieldErrors;
    valid: boolean;
    value: FormStateEntryValue;
  }) => void;
  onReset?: () => void;
  onSubmit?: (formState: FormStateEntry) => void;
}

export interface FormObjectProps {
  name: string;
  onReset?: () => void;
}

export interface FormArrayProps {
  factory: () => FormStateEntryValue;
  name: string;
  onReset?: () => void;
}

export interface ValidationError {
  substitutes?: TranslationSubstitute[];
  text: string;
}

export interface ValidityCheck {
  errors: ValidationError[];
  valid: boolean;
}

export interface DependencyExtractor {
  (formData: FormStateEntryValue): FormStateEntryValue;
}

export interface Validator<A> {
  (value: A, dependencyValue?: FormStateEntryValue): ValidityCheck | Promise<ValidityCheck>;
}

export interface UseFieldConfig<T> {
  dependencyExtractor?: DependencyExtractor;
  formatter?: Formatter<T>;
  initialValue: T;
  name: string;
  onBlur?: FocusEventHandler<Element>;
  onFocus?: FocusEventHandler<Element>;
  sideEffect?: ({ methods, value }: { methods: FormContext['methods']; value: T }) => void;
  validator?: Validator<T>;
}

export interface UseFieldState<T> {
  errors: ValidationError[];
  focused: boolean;
  touched: boolean;
  valid: boolean;
  validating: boolean;
  value: T;
}

export interface UseFieldReturnType<T> {
  errors: ValidationError[];
  fieldRef: MutableRefObject<HTMLElement | HTMLInputElement | null>;
  focused: boolean;
  onBlurHandler: FocusEventHandler<HTMLElement>;
  onChangeHandler: (value: T) => Promise<void>;
  onFocusHandler: FocusEventHandler<HTMLElement>;
  touched: boolean;
  valid: boolean;
  validating: boolean;
  value: T;
}

export interface FormDataProviderContext {
  errors: FieldErrors;
  formData: FormStateEntry;
  initialData?: FormStateEntry;
}

export interface FormRootProviderProps {
  value: {
    errors: FieldErrors;
    formData: FormStateEntry;
  };
}

export interface FormSideEffectProps {
  dependencyExtractor: (formData: FormStateEntryValue) => unknown[];
  effect: (
    dependencies: unknown[],
    { methods }: { methods: FormContext['methods'] }
  ) => void | Promise<void>;
}

export interface OldNewValue<T> {
  initial?: boolean;
  newValue: T;
  oldValue?: T;
}

export type Formatter<T> = (oldNewValue: OldNewValue<T>) => T;

export interface UseFormArrayParams<T> {
  initialValue: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factories: { [key: string]: () => any };
}

export type FieldRenderCondition = (formData: FormStateEntryValue) => boolean;

export interface ConditionalFieldsProps extends Animatable, Stylable {
  children: ReactNode | ReactNode[];
  condition: FieldRenderCondition;
  noScroll?: boolean;
  scrollTimeout?: number;
}

export type FormArrayFunctionArguments = [FormStateEntryValue, () => void, (index: number) => void];

export interface FormArrayWrapperProps {
  children:
    | ReactNode
    | ReactNode[]
    | ((data: FormArrayFunctionArguments) => ReactNode | ReactNode[]);
  factory?: () => FormStateEntryValue;
  initialValue?: FormStateEntryValue[];
  resetFlag: ResetFlag;
}

export interface FormUserProps extends Animatable, Stylable {
  children: ({
    formData,
    hideClassName,
    methods
  }: {
    formData: FormStateEntryValue;
    hideClassName: string;
    methods: FormContext['methods'];
  }) => JSX.Element;
}
