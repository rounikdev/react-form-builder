import { FC, memo, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { dayNames, useDatepicker } from '@components';

import { ErrorField } from '../../ErrorField/ErrorField';

import { Control, Weeks } from './components';
import { DatepickerProps } from './types';

import styles from './Datepicker.scss';

export const Datepicker: FC<DatepickerProps> = memo(
  ({
    className,
    initialValue,
    id,
    label,
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder,
    useEndOfDay
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
      initialValue,
      maxDateExtractor,
      minDateExtractor,
      name,
      useEndOfDay
    });

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    return (
      <div ref={containerRef} className={useClass([styles.Container, className], [className])}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          autoComplete="off"
          type="text"
          // aria-live='assertive'
          value={dateInput}
          onChange={inputChangeHandler}
          onBlur={inputBlurHandler}
          onFocus={onFocusHandler}
          placeholder={placeholder}
        />
        <Control
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
            ref={calendarRef}
            role="listbox"
            tabIndex={0}
          >
            <div data-role="control-group">
              <Control
                dataValue={-1}
                onClick={changeMonth}
                icon={<span>prev</span>}
                label="Previous month"
                tabIndex={0}
              />
              <span data-role="month">{monthName}</span>
              <Control
                dataValue={1}
                onClick={changeMonth}
                icon={<span>next</span>}
                label="Next month"
                tabIndex={0}
              />
            </div>
            <div data-role="control-group">
              <Control
                dataValue={-1}
                onClick={changeYear}
                icon={<span>prev</span>}
                label="Previous year"
                tabIndex={0}
              />
              <span data-role="year">{state.year}</span>
              <Control
                dataValue={1}
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
            </div>
          </div>
        ) : null}
        <ErrorField errors={errors} isError={isError} />
      </div>
    );
  }
);

Datepicker.displayName = 'Datepicker';
