import { ChangeEvent, FocusEvent, FocusEventHandler, MouseEvent, RefObject } from 'react';

import { FormStateEntryValue, UseFieldConfig, ValidationError } from '@core/Form/types';

export interface DatepickerState {
  focusedDate: string;
  input: string | null;
  month: number;
  selected?: Date;
  show: boolean;
  toLeft: boolean;
  today: Date;
  year: number;
}

export interface UseDatepickerArgs extends UseFieldConfig<Date | undefined> {
  label?: string | ((dependencyValue: FormStateEntryValue) => string);
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  required?: boolean | ((dependencyValue: FormStateEntryValue) => boolean);
  useEndOfDay?: boolean;
}

export interface DatepickerContext {
  blurCalendar: (event: FocusEvent) => void;
  calendarRef: RefObject<HTMLDivElement>;
  changeMonth: (months: number) => void;
  changeYear: (years: number) => void;
  clearInput: () => void;
  containerRef: RefObject<HTMLDivElement>;
  dateInput: string;
  errors: ValidationError[];
  focusCalendar: () => void;
  focused: boolean;
  hide: () => void;
  inputBlurHandler: (event: FocusEvent) => void;
  inputChangeHandler: (event: ChangeEvent) => void;
  isRequired: boolean;
  label: string;
  maxDate?: Date;
  minDate?: Date;
  monthName: string;
  onBlurHandler: FocusEventHandler<HTMLElement>;
  onFocusHandler: FocusEventHandler<HTMLElement>;
  openButtonRef: RefObject<HTMLButtonElement>;
  selectDate: (date: Date) => void;
  setFocusedDate: (focusedDate: string) => void;
  state: DatepickerState;
  toggle: (event: MouseEvent) => void;
  touched: boolean;
  valid: boolean;
  validating: boolean;
  value?: Date;
  weeks: Date[][];
}
