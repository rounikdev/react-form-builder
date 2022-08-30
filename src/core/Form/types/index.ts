import { Dispatch, FocusEventHandler, MutableRefObject, ReactNode, SetStateAction } from 'react';

import { TranslationSubstitute } from '@core/Translation/types';
import { Animatable, Disableable, Stylable, Testable } from '@types';

export interface Field<T>
  extends Omit<UseFieldConfig<T>, 'initialValue'>,
    Disableable,
    Stylable,
    Testable {
  autoComplete?: string;
  expandError?: boolean;
  hidden?: boolean;
  hideRequiredLabel?: boolean;
  id: string;
  label?: string;
  noLabelTruncate?: boolean;
  placeholder?: string;
  requiredLabel?: string;
  showOptionalLabel?: boolean;
}

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

export interface FormRemovePayload {
  key: string;
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

export type ForceValidateFlag = Record<string, boolean>;

export type ForceValidateMethod = (customForceValidateFlag?: ForceValidateFlag) => void;

export type ResetFlag = { resetKey: string; resetList?: string[] };

export interface FieldErrorsPayload {
  fieldErrors: ValidationError[];
  fieldId: string;
}

export type SetFieldsValuePayload = Record<string, FormStateEntryValue>;

export interface FormContext {
  forceValidateFlag: ForceValidateFlag;
  isEdit: boolean;
  isParentEdit: boolean;
  localEdit: boolean;
  methods: {
    cancel: () => void;
    edit: () => void;
    forceValidate: ForceValidateMethod;
    getFieldId: () => string;
    removeFromForm: (payload: FormRemovePayload) => void;
    reset: () => void;
    save: () => void;
    setInForm: (payload: FormSetPayload) => void;
    touchParent: () => void;
  };
  state: FormState;
  valid: boolean;
}

export interface FieldErrors {
  [key: string]: ValidationError[];
}

export interface FormRootProps extends Testable {
  children: ReactNode;
  className?: string;
  noValidate?: boolean;
  onChange?: (formState: {
    errors: FieldErrors;
    pristine: boolean;
    valid: boolean;
    value: FormStateEntryValue;
  }) => void;
  onReset?: () => void;
  onSubmit?: (formState: FormStateEntry) => void;
}

export interface FormObjectProps {
  children: ReactNode;
  dependencyExtractor?: DependencyExtractor;
  localEdit?: boolean;
  name: string;
  validator?: Validator<FormStateEntryValue>;
}

export type FormArrayChildrenArguments<T> = [
  T[],
  () => void,
  (index: number) => void,
  ValidationError[],
  boolean
];

export interface FormArrayProps<T> {
  children: (items: FormArrayChildrenArguments<T>) => ReactNode;
  dependencyExtractor?: DependencyExtractor;
  factory: () => T;
  initialValue?: T[];
  localEdit?: boolean;
  name: string;
  validator?: Validator<T[]>;
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
  required?: boolean | ((dependencyValue: FormStateEntryValue) => boolean);
  sideEffect?: ({
    dependencyValue,
    methods,
    value
  }: {
    dependencyValue: FormStateEntryValue;
    methods: FormContext['methods'];
    value: T;
  }) => void;
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
  dependencyValue: FormStateEntryValue;
  errors: ValidationError[];
  fieldId: string;
  fieldRef: MutableRefObject<HTMLElement | HTMLInputElement | null>;
  focused: boolean;
  isEdit: boolean;
  isRequired: boolean;
  onBlurHandler: FocusEventHandler<HTMLElement>;
  onChangeHandler: (value: T) => Promise<void>;
  onFocusHandler: FocusEventHandler<HTMLElement>;
  touched: boolean;
  valid: boolean;
  validating: boolean;
  value: T;
}

export interface FormRootProviderContext {
  errors: FieldErrors;
  fieldsToBeSet: SetFieldsValuePayload;
  focusedField: string;
  formData: FormStateEntryValue;
  methods: {
    focusField: (fieldId: string) => void;
    forceValidate: ForceValidateMethod;
    registerFieldErrors?: (payload: FieldErrorsPayload) => void;
    reset: ({ resetList }: { resetList?: ResetFlag['resetList'] }) => void;
    scrollFieldIntoView: (fieldId: string) => void;
    setDirty: () => void;
    setFieldsValue: (payload: SetFieldsValuePayload) => void;
    setResetFlag: Dispatch<SetStateAction<ResetFlag>>;
    setResetRecords: Dispatch<SetStateAction<Record<string, FormStateEntry>>>;
  };
  pristine: boolean;
  resetFlag: ResetFlag;
  resetRecords: Record<string, FormStateEntryValue>;
  scrolledField: string;
}

export interface FormRootProviderProps {
  children: ReactNode;
  value: FormRootProviderContext;
}

export interface FormSideEffectProps {
  dependencyExtractor: (formData: FormStateEntryValue) => unknown[];
  effect: (
    dependencies: unknown[],
    {
      methods
    }: {
      methods: {
        cancel: () => void;
        edit: () => void;
        forceValidate: ForceValidateMethod;
        getFieldId: () => string;
        removeFromForm: (payload: FormRemovePayload) => void;
        reset: ({ resetList }: { resetList?: ResetFlag['resetList'] }) => void;
        save: () => void;
        setInForm: (payload: FormSetPayload) => void;
      };
    }
  ) => void | Promise<void>;
}

export interface OldNewValue<T> {
  dependencyValue?: FormStateEntryValue;
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
  hidden?: boolean;
  noScroll?: boolean;
  scrollTimeout?: number;
}

export interface FormUserProps {
  children: (props: {
    formContext: FormContext;
    formRootContext: FormRootProviderContext;
  }) => JSX.Element | null;
}

export type Pattern = string;

export interface UseFieldDependencyConfig<T> {
  dependencyValue: FormStateEntryValue;
  disabled?: boolean | ((dependencyValue: FormStateEntryValue) => boolean);
  initialValue?: T | ((dependencyValue: FormStateEntryValue) => T);
  label?: string | ((dependencyValue: FormStateEntryValue) => string);
  onChangeHandler?: (value: T) => Promise<void>;
}

export interface UseFieldDependencyReturnType {
  disabled: boolean;
  label: string;
}
