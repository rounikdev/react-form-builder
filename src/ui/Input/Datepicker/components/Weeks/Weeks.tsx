import { FC, memo, useMemo } from 'react';

import { constructWeeksInMonth, getDaysInMonth } from '@components';

import { Day } from '../Day/Day';

interface WeeksProps {
  maxDate?: Date;
  minDate?: Date;
  month: number;
  onSelect: (date: Date) => void;
  selected?: Date;
  today: Date;
  useEndOfDay?: boolean;
  year: number;
}

export const Weeks: FC<WeeksProps> = memo(
  ({ maxDate, minDate, month, onSelect, selected, today, useEndOfDay, year }) => {
    const days = useMemo(
      () => getDaysInMonth({ month, useEndOfDay, year }),
      [month, useEndOfDay, year]
    );

    const weeks = useMemo(() => constructWeeksInMonth(days), [days]);

    const weeksJSX: JSX.Element[] = [];

    for (let i = 0; i < weeks.length; i++) {
      const week = [];

      for (let j = 0; j < weeks[i].length; j++) {
        week.push(
          <Day
            date={weeks[i][j]}
            emptyKey={i + j}
            isOtherMonth={weeks[i][j]?.getMonth() !== month}
            key={i + j}
            maxDate={maxDate}
            minDate={minDate}
            onSelect={onSelect}
            selected={selected}
            today={today}
          />
        );
      }

      weeksJSX.push(
        <div data-role="week" key={i}>
          {week}
        </div>
      );
    }

    return <>{weeksJSX}</>;
  }
);

Weeks.displayName = 'Weeks';
