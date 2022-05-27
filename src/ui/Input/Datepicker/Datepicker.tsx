import { FC, memo, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useDatepicker } from '@components';

import { ErrorField } from '../../ErrorField/ErrorField';

import { Calendar, DatepickerInput } from './components';
import { DatepickerProps } from './types';

import styles from './Datepicker.scss';

export const Datepicker: FC<DatepickerProps> = memo(
  ({
    className,
    dependencyExtractor,
    initialValue,
    id,
    label,
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder,
    required,
    sideEffect,
    useEndOfDay,
    validator
  }) => {
    const {
      calendarRef,
      changeMonth,
      changeYear,
      containerRef,
      dateInput,
      errors,
      focused,
      inputBlurHandler,
      inputChangeHandler,
      maxDate,
      minDate,
      monthName,
      onBlurHandler,
      onFocusHandler,
      selectDate,
      state,
      toggle,
      touched,
      valid,
      value
    } = useDatepicker({
      dependencyExtractor,
      initialValue,
      maxDateExtractor,
      minDateExtractor,
      name,
      sideEffect,
      useEndOfDay,
      validator
    });

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    return (
      <div ref={containerRef} className={useClass([styles.Container, className], [className])}>
        <label className={styles.Label} htmlFor={id}>
          {label}
          <span className={styles.Required}>{required ? 'required' : null}</span>
        </label>
        <DatepickerInput
          calendarIsOpened={state.show}
          id={id}
          onBlur={inputBlurHandler}
          onChange={inputChangeHandler}
          onFocus={onFocusHandler}
          placeholder={placeholder}
          toggle={toggle}
          value={dateInput}
        />
        {state.show ? (
          <Calendar
            changeMonth={changeMonth}
            changeYear={changeYear}
            calendarRef={calendarRef}
            maxDate={maxDate}
            minDate={minDate}
            monthName={monthName}
            onBlurHandler={onBlurHandler}
            onFocusHandler={onFocusHandler}
            selectDate={selectDate}
            state={state}
            useEndOfDay={useEndOfDay}
            value={value}
          />
        ) : null}
        <ErrorField errors={errors} isError={isError} />
      </div>
    );
  }
);

Datepicker.displayName = 'Datepicker';
