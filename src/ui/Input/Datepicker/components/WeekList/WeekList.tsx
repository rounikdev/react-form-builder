import { FC, memo } from 'react';

import { useDatepickerContext } from '@components';

import { Testable } from '../../../../../types';

import { Day } from '../Day/Day';

import styles from './WeekList.scss';

type WeekListProps = Testable;

export const WeekList: FC<WeekListProps> = memo(({ dataTest }) => {
  const { state, weeks } = useDatepickerContext();

  const weeksJSX: JSX.Element[] = [];

  for (let i = 0; i < weeks.length; i++) {
    const week = [];

    for (let j = 0; j < weeks[i].length; j++) {
      week.push(
        <Day
          dataTest={dataTest}
          date={weeks[i][j]}
          isOtherMonth={weeks[i][j]?.getMonth() !== state.month}
          key={i + j}
        />
      );
    }

    weeksJSX.push(
      <tr className={styles.Week} data-test={`${dataTest}-datepicker-week-${i}`} key={i}>
        {week}
      </tr>
    );
  }

  return <>{weeksJSX}</>;
});

WeekList.displayName = 'WeekList';
