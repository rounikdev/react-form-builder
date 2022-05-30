import { FC, memo, Ref } from 'react';

import { useDatepickerContext, useTranslation } from '@components';

import { IconChevronLeft, IconChevronRight } from '../../../../icons';
import { useTabTrap } from '../../../../TabTrap';

import { Control } from '../Control/Control';

import styles from './Controls.scss';

export const Controls: FC = memo(() => {
  const { changeMonth, changeYear, monthName, state } = useDatepickerContext();

  const { translate } = useTranslation();

  const { firstTabFocusableRef, lastTabFocusableRef } = useTabTrap();

  return (
    <>
      <div className={styles.ControlGroup}>
        <h2 aria-live="polite" className={styles.Label}>
          {`${translate(`months.${monthName}`)} ${state.year}`}
        </h2>
        <Control
          onClick={() => changeMonth(-1)}
          icon={<IconChevronLeft action />}
          label={translate('previousMonth') as string}
          ref={firstTabFocusableRef as Ref<HTMLButtonElement>}
        />
        <span className={styles.Month}>{translate(`months.${monthName}`)}</span>
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
        <span className={styles.Year}>{state.year}</span>
        <Control
          onClick={() => changeYear(1)}
          icon={<IconChevronRight action />}
          label={translate('nextYear') as string}
          ref={lastTabFocusableRef as Ref<HTMLButtonElement>}
        />
      </div>
    </>
  );
});

Controls.displayName = 'Controls';
