import { FocusEvent, useCallback, useMemo, useRef, useState } from 'react';

import {
  useKeyboardEvent,
  useOnOutsideClick,
  useUpdate,
  useUpdateOnly
} from '@rounik/react-custom-hooks';

import { useField } from '../../Form';
import { useFormRoot } from '../../Form/providers';

import { monthNames } from './constants';
import { datepickerContext } from './context';
import {
  canBeSelected,
  constructWeeksInMonth,
  formatDateInput,
  getDaysInMonth,
  validateDateInput
} from './helpers';
import { DatepickerContext, DatepickerState, UseDatepickerArgs } from './types';

export const useDatepicker = ({
  dependencyExtractor,
  formatter,
  initialValue,
  name,
  maxDateExtractor,
  minDateExtractor,
  onBlur,
  onFocus,
  sideEffect,
  useEndOfDay,
  validator
}: UseDatepickerArgs) => {
  const {
    errors,
    focused,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    touched,
    valid,
    validating,
    value
  } = useField({
    dependencyExtractor,
    formatter,
    initialValue,
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });

  const { formData } = useFormRoot();

  const maxDate = useMemo(
    () => (maxDateExtractor ? maxDateExtractor(formData) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxDateExtractor, formData]
  );

  const minDate = useMemo(
    () => (minDateExtractor ? minDateExtractor(formData) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minDateExtractor, formData]
  );

  const [state, setState] = useState<DatepickerState>({
    focusedDate: '',
    input: null,
    month: new Date().getMonth(),
    today: new Date(),
    toLeft: false,
    selected: undefined,
    show: false,
    year: new Date().getFullYear()
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const openButtonRef = useRef<HTMLButtonElement>(null);

  const dateInput = useMemo(() => {
    let dateInputValue = state.input || '';

    const validDate = validateDateInput({ dateString: dateInputValue, useEndOfDay });

    if (validDate) {
      dateInputValue = formatDateInput(validDate);
    }

    return dateInputValue;
  }, [state.input, useEndOfDay]);

  const monthName = useMemo(() => monthNames[state.month], [state.month]);

  const weeks = useMemo(() => {
    const days = getDaysInMonth({ month: state.month, useEndOfDay, year: state.year });

    return constructWeeksInMonth(days);
  }, [state.month, state.year, useEndOfDay]);

  const blurCalendar = useCallback(
    (event) => {
      onBlurHandler(event);

      calendarRef.current?.blur();
    },
    [onBlurHandler]
  );

  const setFocusedDate = useCallback((focusedDate: string) => {
    setState((currentState) => ({
      ...currentState,
      focusedDate
    }));
  }, []);

  // Will work for 'Math.abs(month) === 1`
  const changeMonth = useCallback(
    (months) => {
      let newMonth: number;
      let newYear = state.year;

      if (state.month + months > 11) {
        newMonth = 0;
        newYear = state.year + 1;
      } else if (state.month + months < 0) {
        newMonth = 11;
        newYear = state.year - 1;
      } else {
        newMonth = state.month + months;
      }

      setState((currentState) => ({
        ...currentState,
        focusedDate: '',
        month: newMonth,
        toLeft: months < 0,
        year: newYear
      }));
    },
    [state.month, state.year]
  );

  const changeYear = useCallback((years) => {
    setState((currentState) => ({
      ...currentState,
      toLeft: years < 0,
      year: currentState.year + years
    }));
  }, []);

  const clearInput = useCallback(() => {
    onChangeHandler(undefined);

    setState((currentState) => {
      const now = new Date();

      return {
        ...currentState,
        input: null,
        month: minDate?.getMonth() ?? maxDate?.getMonth() ?? now.getMonth(),
        selected: undefined,
        today: now,
        year: minDate?.getFullYear() ?? maxDate?.getFullYear() ?? now.getFullYear()
      };
    });
  }, [maxDate, minDate, onChangeHandler]);

  const selectDate = useCallback(
    (date: Date) => {
      if (canBeSelected({ date, maxDate, minDate })) {
        onChangeHandler(date);

        setState((currentState) => ({
          ...currentState,
          focusedDate: '',
          show: false,
          input: formatDateInput(date)
        }));
      }
    },
    [maxDate, minDate, onChangeHandler]
  );

  const focusCalendar = useCallback(() => {
    calendarRef.current?.focus();

    onFocusHandler(new Event('focus') as unknown as FocusEvent<HTMLElement, Element>);
  }, [onFocusHandler]);

  const inputBlurHandler = useCallback(
    (event) => {
      const {
        target: { value: inputValue }
      } = event;

      const validDate = validateDateInput({
        dateString: inputValue,
        useEndOfDay
      });

      if (validDate) {
        if (canBeSelected({ date: validDate, maxDate, minDate })) {
          selectDate(validDate);
        } else {
          clearInput();
        }
      } else {
        clearInput();
      }

      onBlurHandler(event);
    },
    [clearInput, maxDate, minDate, onBlurHandler, selectDate, useEndOfDay]
  );

  const inputChangeHandler = useCallback(({ target: { value: inputValue } }) => {
    setState((currentState) => ({
      ...currentState,
      focusedDate: '',
      input: inputValue,
      show: false
    }));
  }, []);

  const toggle = useCallback(
    (event) => {
      event.preventDefault();

      setState((currentState) => {
        const { selected, show } = currentState;

        const now = new Date();

        return {
          ...currentState,
          month: selected
            ? selected.getMonth()
            : minDate?.getMonth() ?? maxDate?.getMonth() ?? now.getMonth(),
          show: !show,
          year: selected
            ? selected.getFullYear()
            : minDate?.getFullYear() ?? maxDate?.getFullYear() ?? now.getFullYear()
        };
      });
    },
    [maxDate, minDate]
  );

  const hide = useCallback(() => {
    if (state.show) {
      setState((currentState) => ({
        ...currentState,
        focusedDate: '',
        show: false
      }));
    }
  }, [state.show]);

  useOnOutsideClick({ callback: hide, element: containerRef });

  useKeyboardEvent({
    eventType: 'keyup',
    handler: (event) => {
      if (state.show) {
        let newFocusedDate = 0;

        let date = new Date();

        if (
          state.focusedDate === '' &&
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)
        ) {
          newFocusedDate = weeks[0][0].getTime();

          setFocusedDate(`${newFocusedDate}`);

          return;
        }

        switch (event.code) {
          case 'Tab':
            setFocusedDate('');

            break;

          case 'Escape':
            hide();

            openButtonRef?.current?.focus();

            break;

          case 'ArrowRight':
            date = new Date(parseInt(state.focusedDate, 10));
            date.setDate(date.getDate() + 1);
            newFocusedDate = date.getTime();

            if (newFocusedDate > weeks[weeks.length - 1][6].getTime()) {
              changeMonth(1);
            }

            setFocusedDate(`${newFocusedDate}`);

            break;

          case 'ArrowLeft':
            date = new Date(parseInt(state.focusedDate, 10));
            date.setDate(date.getDate() - 1);
            newFocusedDate = date.getTime();

            if (newFocusedDate < weeks[0][0].getTime()) {
              changeMonth(-1);
            }

            setFocusedDate(`${newFocusedDate}`);

            break;

          case 'ArrowDown':
            date = new Date(parseInt(state.focusedDate, 10));
            date.setDate(date.getDate() + 7);
            newFocusedDate = date.getTime();

            if (newFocusedDate > weeks[weeks.length - 1][6].getTime()) {
              changeMonth(1);
            }

            setFocusedDate(`${newFocusedDate}`);

            break;

          case 'ArrowUp':
            date = new Date(parseInt(state.focusedDate, 10));
            date.setDate(date.getDate() - 7);
            newFocusedDate = date.getTime();

            if (newFocusedDate < weeks[0][0].getTime()) {
              changeMonth(-1);
            }

            setFocusedDate(`${newFocusedDate}`);

            break;
        }
      }
    }
  });

  useUpdate(() => {
    const selected = value || null;

    const input = selected ? formatDateInput(selected) : '';

    if (selected && canBeSelected({ date: selected, maxDate, minDate })) {
      setState((currentState) => ({ ...currentState, input, selected }));
    } else {
      clearInput();
    }
  }, [clearInput, maxDate, minDate, value]);

  useUpdate(() => {
    if (!value) {
      clearInput();
    }
  }, [clearInput, value]);

  useUpdate(() => {
    setState((currentState) => ({
      ...currentState,
      month: value?.getMonth() ?? currentState.month,
      year: value?.getFullYear() ?? currentState.year
    }));
  }, [value]);

  useUpdate(() => {
    setState((currentState) => ({
      ...currentState,
      month: minDate?.getMonth() ?? maxDate?.getMonth() ?? currentState.month,
      year: minDate?.getFullYear() ?? maxDate?.getFullYear() ?? currentState.year
    }));
  }, [minDate, maxDate]);

  useUpdate(() => {
    if (state.show) {
      focusCalendar();
    }
  }, [focusCalendar, state.show]);

  useUpdateOnly(() => {
    if (!state.show) {
      blurCalendar(new Event('focus'));
    }
  }, [blurCalendar, state.show]);

  const context: DatepickerContext = useMemo(
    () => ({
      blurCalendar,
      calendarRef,
      changeMonth,
      changeYear,
      clearInput,
      containerRef,
      dateInput,
      errors,
      focusCalendar,
      focused,
      hide,
      maxDate,
      minDate,
      monthName,
      inputBlurHandler,
      inputChangeHandler,
      onBlurHandler,
      onFocusHandler,
      openButtonRef,
      Provider: datepickerContext.Provider,
      selectDate,
      setFocusedDate,
      state,
      toggle,
      touched,
      valid,
      validating,
      value,
      weeks
    }),
    [
      blurCalendar,
      changeMonth,
      changeYear,
      clearInput,
      dateInput,
      errors,
      focusCalendar,
      focused,
      hide,
      inputBlurHandler,
      inputChangeHandler,
      maxDate,
      minDate,
      monthName,
      onBlurHandler,
      onFocusHandler,
      openButtonRef,
      selectDate,
      setFocusedDate,
      state,
      toggle,
      touched,
      valid,
      validating,
      value,
      weeks
    ]
  );

  return {
    context,
    Provider: datepickerContext.Provider
  };
};
