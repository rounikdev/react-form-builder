import { FC, memo } from 'react';

import { dayNames, useDatepickerContext, useTranslation } from '@components';

import { Animator } from '../../../../Animator';

import { Controls } from '../Controls/Controls';
import { WeekList } from '../WeekList/WeekList';

import styles from './Calendar.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldAnimate = (currentChildren: any, newChildren: any) =>
  currentChildren?.key !== newChildren?.key;

export const Calendar: FC = memo(() => {
  const { calendarRef, onBlurHandler, onFocusHandler, state } = useDatepickerContext();

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
      <Controls />
      <table role="grid">
        <thead>
          <tr className={styles.Weekdays}>
            {dayNames.map((weekDayName) => {
              return (
                <th className={styles.Weekday} key={weekDayName}>
                  {translate(`weekdays.${weekDayName}`)}
                </th>
              );
            })}
          </tr>
        </thead>
        <Animator
          className={styles.WeekList}
          enterClass={state.toLeft ? styles.FromLeftEnter : styles.FromRightEnter}
          exitClass={state.toLeft ? styles.FromLeftExit : styles.FromRightExit}
          shouldAnimate={shouldAnimate}
          tag="tbody"
        >
          {/* 'key' helps in deciding when to animate */}
          <WeekList key={`${state.month}.${state.year}`} />
        </Animator>
      </table>
    </div>
  );
});

Calendar.displayName = 'Calendar';
