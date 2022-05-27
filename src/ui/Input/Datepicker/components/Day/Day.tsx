import { FC, memo, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { areSameDay, canBeSelected, useDatepickerContext } from '@components';

import styles from './Day.scss';

interface DayProps {
  date: Date;
  isOtherMonth?: boolean;
}

export const Day: FC<DayProps> = memo(({ date, isOtherMonth }) => {
  const { maxDate, minDate, selectDate, state, value } = useDatepickerContext();

  const selectable = useMemo(
    () =>
      canBeSelected({
        date,
        maxDate,
        minDate
      }),
    [date, maxDate, minDate]
  );

  const isSelected = value && areSameDay(date, value);

  const isToday = areSameDay(date, state.today);

  return (
    <span
      aria-current={areSameDay(date, state.today) ? 'date' : 'false'}
      aria-label={date.toLocaleDateString(window.navigator.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
      aria-selected={!!value}
      className={useClass(
        [
          styles.Container,
          isOtherMonth && styles.FromOtherMonth,
          !selectable && styles.NotSelectable,
          isSelected && styles.Selected,
          isToday && styles.Today
        ],
        [isOtherMonth, isSelected, isToday, selectable]
      )}
      data-date={date.toLocaleDateString()}
      key={date.getTime()}
      {...(selectable ? { onClick: () => selectDate(date) } : {})}
      onKeyDown={({ keyCode }) => {
        if (selectable && keyCode === 13) {
          selectDate(date);
        }
      }}
      role="option"
      tabIndex={0}
    >
      {date.getDate()}
    </span>
  );
});

Day.displayName = 'Day';
