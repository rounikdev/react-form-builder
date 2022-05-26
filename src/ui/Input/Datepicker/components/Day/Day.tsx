import { FC, memo, useMemo } from 'react';

import { areSameDay, canBeSelected } from '../../helpers';

interface DayProps {
  date: Date;
  emptyKey: number;
  isOtherMonth?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onSelect: (date: Date) => void;
  selected?: Date;
  today: Date;
}

export const Day: FC<DayProps> = memo(
  ({ date, emptyKey, isOtherMonth, maxDate, minDate, onSelect, selected, today }) => {
    const selectable = useMemo(
      () =>
        canBeSelected({
          date,
          maxDate,
          minDate
        }),
      [date, maxDate, minDate]
    );

    return date ? (
      <span
        aria-current={areSameDay(date, today) ? 'date' : 'false'}
        aria-label={date.toLocaleDateString(window.navigator.language, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
        aria-selected={!!selected}
        data-date={date?.toLocaleDateString()}
        data-empty="false"
        data-isothermonth={isOtherMonth}
        data-not-selectable={!selectable}
        data-role="day"
        data-selected={selected && areSameDay(date, selected)}
        data-today={areSameDay(date, today)}
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
    ) : (
      <span data-empty="true" data-role="day" key={emptyKey}>
        *
      </span>
    );
  }
);

Day.displayName = 'Day';
