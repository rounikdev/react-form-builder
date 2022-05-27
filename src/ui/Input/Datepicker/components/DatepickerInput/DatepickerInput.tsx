import { FC, memo } from 'react';

import { useDatepickerContext, useTranslation } from '@components';

import { IconCalendar } from '../../../../icons';

import { Control } from '../Control/Control';

import styles from './DatepickerInput.scss';

interface DatepickerInputProps {
  id: string;
  placeholder?: string;
}

export const DatepickerInput: FC<DatepickerInputProps> = memo(({ id, placeholder = '' }) => {
  const { dateInput, inputBlurHandler, inputChangeHandler, onFocusHandler, state, toggle } =
    useDatepickerContext();

  const { translate } = useTranslation();

  return (
    <div className={styles.Container}>
      <input
        aria-label={dateInput ? '' : 'noDateSelected'}
        autoComplete="off"
        className={styles.Input}
        id={id}
        onBlur={inputBlurHandler}
        onChange={inputChangeHandler}
        onFocus={onFocusHandler}
        placeholder={translate(placeholder) as string}
        value={dateInput}
      />
      <Control
        className={styles.OpenControl}
        tabIndex={0}
        label={translate('chooseDate') as string}
        describedBy={id}
        expanded={state.show}
        onClick={toggle}
        icon={<IconCalendar action />}
      />
    </div>
  );
});

DatepickerInput.displayName = 'DatepickerInput';
