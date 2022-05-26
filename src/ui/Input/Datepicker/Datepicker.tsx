import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useField } from '@components';
import { useFormRoot } from '@components/Form/providers';

import { ErrorField } from '../../ErrorField/ErrorField';

import { Animate, Control, Weeks } from './components';
import { dayNames, monthNames } from './constants';
import { canBeSelected, formatDateInput, validateDateInput } from './helpers';
import { DatepickerProps, DatepickerState } from './types';
import { useUpdate } from '@rounik/react-custom-hooks';

const Datepicker: FC<DatepickerProps> = (props) => {
  const {
    className,
    controlClass,
    exitDuration,
    iconClass,
    initialValue,
    inputFieldClass,
    id,
    label,
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder,
    slideTimeout,
    useEndOfDay,
    ...useFieldProps
  } = props;

  const { errors, focused, onBlurHandler, onChangeHandler, onFocusHandler, touched, valid, value } =
    useField({ initialValue, name, ...useFieldProps });

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

  const calendar = useRef<HTMLDivElement>(null);

  const element = useRef<HTMLDivElement>(null);

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

      if (calendar.current instanceof HTMLDivElement) {
        calendar.current.blur();
      }
    },
    [onBlurHandler]
  );

  // Will work for 'month === 1`
  const changeMonth = useCallback(
    (event, months) => {
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

  const changeYear = useCallback((event, years) => {
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
      if (state.show && element.current && !element.current.contains(target)) {
        setState((currentState) => ({ ...currentState, show: false }));
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
    calendar.current && calendar.current.focus();
  }, []);

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

  useEffect(() => {
    document.addEventListener('click', hide);

    return () => {
      document.removeEventListener('click', hide);
    };
  }, [hide]);

  useEffect(() => {
    const selected = value || null;

    const input = selected ? formatDateInput(selected) : '';

    if (selected && canBeSelected({ date: selected, maxDate, minDate })) {
      setState((currentState) => ({ ...currentState, input, selected }));
    } else {
      clearInput();
    }
  }, [clearInput, maxDate, minDate, value]);

  useEffect(() => {
    if (state.show) {
      focusCalendar();
    } else {
      blurCalendar(new Event('focus'));
    }
  }, [blurCalendar, focusCalendar, state.show]);

  // reset logic when no initial value
  useEffect(() => {
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

  const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

  return (
    <div ref={element} className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        autoComplete="off"
        className={inputFieldClass}
        type="text"
        // aria-live='assertive'
        value={dateInput}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        onFocus={onFocusHandler}
        placeholder={placeholder}
      />
      <Control
        className={iconClass}
        tabIndex={0}
        label="Open datepicker"
        describedBy={id}
        expanded={state.show}
        onClick={toggle}
        icon={<span>open</span>}
      />

      {state.show ? (
        <div
          aria-label="Datepicker"
          data-role="datepicker"
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          ref={calendar}
          role="listbox"
          tabIndex={0}
        >
          <div data-role="control-group">
            <Control
              dataValue={-1}
              className={controlClass}
              onClick={changeMonth}
              icon={<span>prev</span>}
              label="Previous month"
              tabIndex={0}
            />
            <span data-role="month">{monthName}</span>
            <Control
              dataValue={1}
              className={controlClass}
              onClick={changeMonth}
              icon={<span>next</span>}
              label="Next month"
              tabIndex={0}
            />
          </div>
          <div data-role="control-group">
            <Control
              dataValue={-1}
              className={controlClass}
              onClick={changeYear}
              icon={<span>prev</span>}
              label="Previous year"
              tabIndex={0}
            />
            <span data-role="year">{state.year}</span>
            <Control
              dataValue={1}
              className={controlClass}
              onClick={changeYear}
              icon={<span>next</span>}
              label="Next month"
              tabIndex={0}
            />
          </div>
          <div data-role="week-days-wrapper">
            {dayNames.map((weekDayName) => {
              return (
                <span key={weekDayName} data-role="week-day">
                  {weekDayName}
                </span>
              );
            })}
          </div>
          <div data-role="weeks-wrapper">
            {/* <Animate
              changed={state.changed}
              timeout={slideTimeout || 400}
              toLeft={state.toLeft}
              width={(calendar.current && calendar.current.offsetWidth) || 0}
            > */}
            <Weeks
              maxDate={maxDate}
              minDate={minDate}
              month={state.month}
              onSelect={selectDate}
              selected={value}
              today={state.today}
              useEndOfDay={useEndOfDay}
              year={state.year}
            />
            {/* </Animate> */}
          </div>
        </div>
      ) : null}
      <ErrorField errors={errors} isError={isError} />
    </div>
  );
};

export default memo(Datepicker);
