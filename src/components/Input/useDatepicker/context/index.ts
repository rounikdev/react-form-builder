import { createContext, Provider } from 'react';

import { DatepickerContext } from '../types';

export const datepickerContext = createContext<DatepickerContext>({
  blurCalendar: () => {
    // default implementation
  },
  calendarRef: { current: null },
  changeMonth: () => {
    // default implementation
  },
  changeYear: () => {
    // default implementation
  },
  clearInput: () => {
    // default implementation
  },
  containerRef: { current: null },
  dateInput: '',
  errors: [],
  focusCalendar: () => {
    // default implementation
  },
  focused: false,
  hide: () => {
    // default implementation
  },
  maxDate: undefined,
  minDate: undefined,
  monthName: '',
  inputBlurHandler: () => {
    // default implementation
  },
  inputChangeHandler: () => {
    // default implementation
  },
  onBlurHandler: () => {
    // default implementation
  },
  onFocusHandler: () => {
    // default implementation
  },
  Provider: {} as Provider<DatepickerContext>,
  selectDate: () => {
    // default implementation
  },
  state: {
    input: null,
    month: new Date().getMonth(),
    today: new Date(),
    toLeft: false,
    show: false,
    year: new Date().getFullYear()
  },
  toggle: () => {
    // default implementation
  },
  touched: false,
  valid: true,
  validating: false,
  value: undefined,
  weeks: []
});

datepickerContext.displayName = 'DatepickerContext';
