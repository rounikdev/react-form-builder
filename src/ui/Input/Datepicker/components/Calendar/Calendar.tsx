import { FC, FocusEventHandler, memo, RefObject } from 'react';

import { dayNames, useTranslation } from '@components';
import { DatepickerState } from '../../../../../components';

import { IconChevronLeft, IconChevronRight } from '../../../../icons';

import { Control } from '../Control/Control';
import { WeekList } from '../WeekList/WeekList';

import styles from './Calendar.scss';

interface CalendarProps {
  changeMonth: (months: number) => void;
  changeYear: (years: number) => void;
  calendarRef: RefObject<HTMLDivElement>;
  maxDate?: Date;
  minDate?: Date;
  monthName: string;
  onBlurHandler: FocusEventHandler<HTMLElement>;
  onFocusHandler: FocusEventHandler<HTMLElement>;
  selectDate: (date: Date) => void;
  state: DatepickerState;
  useEndOfDay?: boolean;
  value?: Date;
}

export const Calendar: FC<CalendarProps> = memo(
  ({
    calendarRef,
    changeMonth,
    changeYear,
    maxDate,
    minDate,
    monthName,
    onBlurHandler,
    onFocusHandler,
    selectDate,
    state,
    useEndOfDay,
    value
  }) => {
    const { translate } = useTranslation();

    return (
      <div
        aria-label={translate('chooseDate') as string}
        aria-modal={true}
        className={styles.Container}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        ref={calendarRef}
        role="dialog"
        tabIndex={0}
      >
        <div className={styles.ControlGroup}>
          <Control
            onClick={() => changeMonth(-1)}
            icon={<IconChevronLeft action />}
            label={translate('previousMonth') as string}
          />
          <span aria-live="polite" className={styles.Month}>
            {translate(monthName)}
          </span>
          <Control
            onClick={() => changeMonth(1)}
            icon={<IconChevronRight action />}
            label={translate('nextMonth') as string}
          />
        </div>
        <div className={styles.ControlGroup}>
          <Control
            onClick={() => changeYear(-1)}
            icon={<IconChevronLeft action />}
            label={translate('previousYear') as string}
          />
          <span aria-live="polite" className={styles.Year}>
            {state.year}
          </span>
          <Control
            onClick={() => changeYear(1)}
            icon={<IconChevronRight action />}
            label={translate('nextYear') as string}
          />
        </div>
        <div className={styles.Weekdays}>
          {dayNames.map((weekDayName) => {
            return (
              <span className={styles.Weekday} key={weekDayName}>
                {translate(weekDayName)}
              </span>
            );
          })}
        </div>
        <div className={styles.WeekList}>
          <WeekList
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
    );
  }
);

Calendar.displayName = 'Calendar';
