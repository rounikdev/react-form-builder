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
  const {
    dateInput,
    inputBlurHandler,
    inputChangeHandler,
    onFocusHandler,
    openButtonRef,
    state,
    toggle
  } = useDatepickerContext();

  const { translate } = useTranslation();

  return (
    <div className={styles.Container}>
      <input
        aria-label={dateInput ? '' : 'noDateSelected'}
        aria-live="polite"
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
        label={translate('chooseDate') as string}
        expanded={state.show}
        onClick={toggle}
        onFocus={onFocusHandler}
        icon={<IconCalendar action />}
        ref={openButtonRef}
      />
    </div>
  );
});

DatepickerInput.displayName = 'DatepickerInput';
