import { ChangeEvent, FocusEvent, FocusEventHandler, MouseEvent, RefObject } from 'react';

import { FormStateEntryValue, UseFieldConfig, ValidationError } from '@core/Form/types';

export interface DatepickerState {
  focusedDate: string;
  input: string | null;
  month: number;
  selected?: Date;
  today: Date;
  toLeft: boolean;
  show: boolean;
  year: number;
}

export interface UseDatepickerArgs extends UseFieldConfig<Date | undefined> {
  maxDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
  minDateExtractor?: (formValue: FormStateEntryValue) => Date | undefined;
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
  maxDate?: Date;
  minDate?: Date;
  monthName: string;
  inputBlurHandler: (event: FocusEvent) => void;
  inputChangeHandler: (event: ChangeEvent) => void;
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
