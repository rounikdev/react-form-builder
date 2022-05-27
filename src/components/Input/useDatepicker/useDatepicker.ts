import { FocusEvent, useCallback, useMemo, useRef, useState } from 'react';

import { useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { useField } from '../../Form';
import { useFormRoot } from '../../Form/providers';

import { monthNames } from './constants';
import { canBeSelected, formatDateInput, validateDateInput } from './helpers';
import { DatepickerState, UseDatepickerArgs } from './types';

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
    [maxDateExtractor ? maxDateExtractor(formData) : undefined]
  );

  const minDate = useMemo(
    () => (minDateExtractor ? minDateExtractor(formData) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minDateExtractor ? minDateExtractor(formData) : undefined]
  );

  const [state, setState] = useState<DatepickerState>({
    changed: { init: true },
    input: null,
    month: new Date().getMonth(),
    today: new Date(),
    toLeft: false,
    show: false,
    year: new Date().getFullYear()
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const dateInput = useMemo(() => {
    let dateInputValue = state.input || '';

    if (dateInputValue && validateDateInput({ dateString: dateInputValue, useEndOfDay })) {
      dateInputValue = formatDateInput(
        validateDateInput({ dateString: dateInputValue, useEndOfDay })
      );
    } else {
      dateInputValue = state.input || '';
    }

    return dateInputValue;
  }, [state.input, useEndOfDay]);

  const monthName = useMemo(() => monthNames[state.month], [state.month]);

  const blurCalendar = useCallback(
    (event) => {
      if (onBlurHandler) {
        onBlurHandler(event);
      }

      if (calendarRef.current instanceof HTMLDivElement) {
        calendarRef.current.blur();
      }
    },
    [onBlurHandler]
  );

  // Will work for 'month === 1`
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
        changed: {},
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
      changed: {},
      toLeft: years < 0,
      year: currentState.year + years
    }));
  }, []);

  const clearInput = useCallback(() => {
    onChangeHandler(undefined);

    setState((currentState) => {
      const today = new Date();

      return {
        ...currentState,
        input: null,
        month: today.getMonth(),
        today,
        year: today.getFullYear()
      };
    });
  }, [onChangeHandler]);

  const hide = useCallback(
    ({ target }) => {
      if (state.show && containerRef.current && !containerRef.current.contains(target)) {
        setState((currentState) => ({
          ...currentState,
          month: new Date().getMonth(),
          show: false,
          year: new Date().getFullYear()
        }));
      }
    },
    [state.show]
  );

  const selectDate = useCallback(
    (date) => {
      if (canBeSelected({ date, maxDate, minDate })) {
        onChangeHandler(date);

        setState((currentState) => ({
          ...currentState,
          show: false,
          input: formatDateInput(date)
        }));
      }
    },
    [maxDate, minDate, onChangeHandler]
  );

  const focusCalendar = useCallback(() => {
    calendarRef.current && calendarRef.current.focus();
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

      if (onBlurHandler) {
        onBlurHandler(event);
      }
    },
    [clearInput, maxDate, minDate, onBlurHandler, selectDate, useEndOfDay]
  );

  const inputChangeHandler = useCallback(({ target: { value: inputValue } }) => {
    setState((currentState) => ({
      ...currentState,
      input: inputValue,
      show: false
    }));
  }, []);

  const toggle = useCallback((event) => {
    event.preventDefault();
    setState((currentState) => {
      const { month, selected, show, year } = currentState;

      return {
        ...currentState,
        changed: { init: !show },
        month: selected ? selected.getMonth() : month,
        show: !show,
        year: selected ? selected.getFullYear() : year
      };
    });
  }, []);

  useUpdate(() => {
    document.addEventListener('click', hide);

    return () => {
      document.removeEventListener('click', hide);
    };
  }, [hide]);

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

  return {
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
    selectDate,
    state,
    toggle,
    touched,
    valid,
    validating,
    value
  };
};
