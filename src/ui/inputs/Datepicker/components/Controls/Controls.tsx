import { FC, memo, Ref } from 'react';

import { useDatepickerContext, useTranslation } from '@core';

import { Testable } from '../../../../../types';

import { IconChevronLeft, IconChevronRight } from '../../../../icons';
import { useTabTrap } from '../../../../TabTrap';

import { Control } from '../Control/Control';

import styles from './Controls.scss';

type ControlsProps = Testable;

export const Controls: FC<ControlsProps> = memo(({ dataTest }) => {
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
          dataTest={`${dataTest}-datepicker-previous-month`}
          icon={<IconChevronLeft action />}
          label={translate('previousMonth') as string}
          onClick={() => changeMonth(-1)}
          ref={firstTabFocusableRef as Ref<HTMLButtonElement>}
        />
        <span className={styles.Month} data-test={`${dataTest}-datepicker-month`}>
          {translate(`months.${monthName}`)}
        </span>
        <Control
          dataTest={`${dataTest}-datepicker-next-month`}
          icon={<IconChevronRight action />}
          label={translate('nextMonth') as string}
          onClick={() => changeMonth(1)}
        />
      </div>
      <div className={styles.ControlGroup}>
        <Control
          dataTest={`${dataTest}-datepicker-previous-year`}
          icon={<IconChevronLeft action />}
          label={translate('previousYear') as string}
          onClick={() => changeYear(-1)}
        />
        <span className={styles.Year} data-test={`${dataTest}-datepicker-year`}>
          {state.year}
        </span>
        <Control
          dataTest={`${dataTest}-datepicker-next-year`}
          icon={<IconChevronRight action />}
          label={translate('nextYear') as string}
          onClick={() => changeYear(1)}
          ref={lastTabFocusableRef as Ref<HTMLButtonElement>}
        />
      </div>
    </>
  );
});

Controls.displayName = 'Controls';
