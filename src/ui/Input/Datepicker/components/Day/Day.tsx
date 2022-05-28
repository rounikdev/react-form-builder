import { FC, memo, useMemo, useRef } from 'react';

import { useClass, useUpdate } from '@rounik/react-custom-hooks';

import { areSameDay, canBeSelected, useDatepickerContext } from '@components';

import styles from './Day.scss';

interface DayProps {
  date: Date;
  isOtherMonth?: boolean;
}

export const Day: FC<DayProps> = memo(({ date, isOtherMonth }) => {
  const { maxDate, minDate, selectDate, state, value } = useDatepickerContext();

  const elementRef = useRef<HTMLButtonElement>(null);

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

  useUpdate(() => {
    if (isSelected) {
      return elementRef.current?.focus();
    }

    if (!value && isToday) {
      return elementRef.current?.focus();
    }
  }, [isSelected, isToday, value]);

  return (
    <td
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
    >
      <button
        aria-current={areSameDay(date, state.today) ? 'date' : 'false'}
        aria-label={date.toLocaleDateString(window.navigator.language, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
        {...(isSelected ? { 'aria-selected': true } : {})}
        className={styles.Button}
        data-date={date.toLocaleDateString()}
        disabled={!selectable}
        key={date.getTime()}
        {...(selectable ? { onClick: () => selectDate(date) } : {})}
        onKeyDown={({ code }) => {
          if ((selectable && code === 'Enter') || code === 'Space') {
            selectDate(date);
          }
        }}
        ref={elementRef}
        tabIndex={0}
      >
        {date.getDate()}
      </button>
    </td>
  );
});

Day.displayName = 'Day';
