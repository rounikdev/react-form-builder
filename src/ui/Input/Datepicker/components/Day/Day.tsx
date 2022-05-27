import { FC, memo, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { areSameDay, canBeSelected } from '@components';

import styles from './Day.scss';

interface DayProps {
  date: Date;
  isOtherMonth?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onSelect: (date: Date) => void;
  selected?: Date;
  today: Date;
}

export const Day: FC<DayProps> = memo(
  ({ date, isOtherMonth, maxDate, minDate, onSelect, selected, today }) => {
    const selectable = useMemo(
      () =>
        canBeSelected({
          date,
          maxDate,
          minDate
        }),
      [date, maxDate, minDate]
    );

    const isSelected = selected && areSameDay(date, selected);

    const isToday = areSameDay(date, today);

    return (
      <span
        aria-current={areSameDay(date, today) ? 'date' : 'false'}
        aria-label={date.toLocaleDateString(window.navigator.language, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
        aria-selected={!!selected}
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
        {...(selectable ? { onClick: () => onSelect(date) } : {})}
        onKeyDown={({ keyCode }) => {
          if (selectable && keyCode === 13) {
            onSelect(date);
          }
        }}
        role="option"
        tabIndex={0}
      >
        {date.getDate()}
      </span>
    );
  }
);

Day.displayName = 'Day';
