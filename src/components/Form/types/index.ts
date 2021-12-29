import { FocusEventHandler, ReactNode } from 'react';

import { Stylable, Testable } from '../../../types';

export type FormType = 'array' | 'object';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormStateEntryValue = any | any[];

export enum FormActions {
  SET_IN_FORM = 'SET_IN_FORM',
  REMOVE_FROM_FORM = 'REMOVE_FROM_FORM'
}

export interface FormSetPayload {
  key: string;
  valid: boolean;
  value: FormStateEntryValue;
}

export interface FormSetAction {
  payload: FormSetPayload;
  type: FormActions.SET_IN_FORM;
}

export interface FormRemoveArguments {
  key: string;
}

export interface FormRemovePayload extends FormRemoveArguments {
  type: string;
}

export interface FormRemoveAction {
  payload: FormRemovePayload;
  type: FormActions.REMOVE_FROM_FORM;
}

export interface FormStateEntry {
  valid: boolean;
  value: FormStateEntryValue;
}

export interface FormState {
  [key: string]: FormStateEntry;
}

export type ForceValidateFlag = Record<string, unknown>;

export type ResetFlag = Record<string, unknown>;

export interface ValidationError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  substitutes?: any[]; // TODO: TranslationSubstitute[]
  text: string;
}

export interface ValidityCheck {
  errors: ValidationError[];
  valid: boolean;
}

export interface DependencyExtractor {
  (formData: FormStateEntryValue): FormStateEntryValue;
}

export interface Validator<T> {
  (value: T, dependencyValue?: FormStateEntryValue): ValidityCheck | Promise<ValidityCheck>;
}

export interface FieldErrorsPayload {
  fieldErrors: ValidationError[];
  fieldId: string;
}

export interface FieldErrors {
  [key: string]: ValidationError[];
}

export interface OldNewValue<T> {
  initial?: boolean;
  newValue: T;
  oldValue?: T;
}

export type Formatter<T> = (oldNewValue: OldNewValue<T>) => T;

export interface FormStatus extends FormStateEntry {
  errors: FieldErrors;
}

export interface FormProps extends Stylable {
  dataTest?: string;
  formTag?: boolean;
  name?: string;
  noValidate?: boolean;
  onChange?: (formStatus: FormStatus) => void;
  onReset?: () => void;
  onSubmit?: (formState: FormStateEntry) => void;
  type?: FormType;
}

export interface FormContext {
  forceValidateFlag: ForceValidateFlag;
  methods: {
    forceValidate: () => void;
    getFieldId: () => string;
    registerFieldErrors?: (payload: FieldErrorsPayload) => void;
    removeFromForm: (payload: FormRemoveArguments) => void;
    reset: () => void;
    setInForm: (payload: FormSetPayload) => void;
  };
  resetFlag: ResetFlag;
  state: FormState;
  valid: boolean;
}

export interface UseFieldConfig<T> {
  dependencyExtractor?: DependencyExtractor;
  formatter?: Formatter<T>;
  initialValue: T;
  name: string;
  onBlur?: FocusEventHandler<Element>;
  onFocus?: FocusEventHandler<Element>;
  sideEffect?: ({ value }: { value: T }) => void;
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

export interface UseFieldReturnType<T> extends UseFieldState<T> {
  onBlurHandler: FocusEventHandler<HTMLElement>;
  onChangeHandler: (value: T) => Promise<void>;
  onFocusHandler: FocusEventHandler<HTMLElement>;
}

export interface Field<T> extends Stylable, Testable, UseFieldConfig<T> {
  disabled?: boolean;
  hidden?: boolean;
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  requiredLabel?: string;
}

export interface FormDataProviderContext {
  errors: FieldErrors;
  formData: FormStateEntry;
}

export interface FormDataProviderProps {
  value: FormDataProviderContext;
}

export interface FormSideEffectProps {
  dependencyExtractor: (formData: FormStateEntryValue) => unknown[];
  effect: (dependencies: unknown[]) => void | Promise<void>;
}

export interface UseFormArrayParams<T> {
  initialValue: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factories: { [key: string]: () => any };
}

export type FieldRenderCondition = (formData: FormStateEntryValue) => boolean;

export interface ConditionalFieldProps extends Stylable {
  animate?: boolean;
  animateDuration?: number;
  children: ReactNode | ReactNode[];
  contentClassName?: string;
  condition: FieldRenderCondition;
  noScroll?: boolean;
  scrollTimeout?: number;
}
