import { FC, memo, ReactNode, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useDatepicker, useTranslation } from '@components';

import { Animator } from '../../Animator';
import { ErrorField } from '../../ErrorField/ErrorField';

import { Calendar, DatepickerInput } from './components';
import { DatepickerProps } from './types';

import styles from './Datepicker.scss';

const shouldAnimate = (currentChildren: ReactNode, newChildren: ReactNode) =>
  !currentChildren || !newChildren;

export const Datepicker: FC<DatepickerProps> = memo(
  ({
    className,
    dependencyExtractor,
    initialValue,
    id,
    label = '',
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder = '',
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

    const { translate } = useTranslation();

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    return (
      <div className={useClass([styles.Container, className], [className])} ref={containerRef}>
        <label className={styles.Label} htmlFor={id}>
          {translate(label)}
          <span className={styles.Required}>{required ? translate('required') : null}</span>
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
        <Animator
          enterClass={styles.CalendarEnter}
          exitClass={styles.CalendarExit}
          shouldAnimate={shouldAnimate}
        >
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
        </Animator>
        <ErrorField errors={errors} isError={isError} />
      </div>
    );
  }
);

Datepicker.displayName = 'Datepicker';
