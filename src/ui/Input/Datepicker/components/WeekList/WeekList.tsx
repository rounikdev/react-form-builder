import { FC, memo } from 'react';

import { useDatepickerContext } from '@components';

import { Day } from '../Day/Day';

import styles from './WeekList.scss';

export const WeekList: FC = memo(() => {
  const { state, weeks } = useDatepickerContext();

  const weeksJSX: JSX.Element[] = [];

  for (let i = 0; i < weeks.length; i++) {
    const week = [];

    for (let j = 0; j < weeks[i].length; j++) {
      week.push(
        <Day
          date={weeks[i][j]}
          isOtherMonth={weeks[i][j]?.getMonth() !== state.month}
          key={i + j}
        />
      );
    }

    weeksJSX.push(
      <div className={styles.Week} key={i}>
        {week}
      </div>
    );
  }

  return <>{weeksJSX}</>;
});

WeekList.displayName = 'WeekList';
