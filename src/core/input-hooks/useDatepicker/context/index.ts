import { createContext } from 'react';

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
  inputBlurHandler: () => {
    // default implementation
  },
  inputChangeHandler: () => {
    // default implementation
  },
  maxDate: undefined,
  minDate: undefined,
  monthName: '',
  onBlurHandler: () => {
    // default implementation
  },
  onFocusHandler: () => {
    // default implementation
  },
  openButtonRef: { current: null },
  selectDate: () => {
    // default implementation
  },
  setFocusedDate: () => {
    // default implementation
  },
  state: {
    focusedDate: '',
    input: null,
    month: new Date().getMonth(),
    show: false,
    today: new Date(),
    toLeft: false,
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
