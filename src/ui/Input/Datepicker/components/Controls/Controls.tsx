import { FC, memo } from 'react';

import { useDatepickerContext, useTranslation } from '@components';

import { IconChevronLeft, IconChevronRight } from '../../../../icons';

import { Control } from '../Control/Control';

import styles from './Controls.scss';

export const Controls: FC = memo(() => {
  const { changeMonth, changeYear, monthName, state } = useDatepickerContext();

  const { translate } = useTranslation();

  return (
    <>
      <div className={styles.ControlGroup}>
        <Control
          onClick={() => changeMonth(-1)}
          icon={<IconChevronLeft action />}
          label={translate('previousMonth') as string}
        />
        <span aria-live="polite" className={styles.Month}>
          {translate(`months.${monthName}`)}
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
    </>
  );
});

Controls.displayName = 'Controls';
