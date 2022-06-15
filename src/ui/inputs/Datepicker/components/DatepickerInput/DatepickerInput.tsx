import { FC, memo } from 'react';

import { useDatepickerContext, useTranslation } from '@core';

import { Testable } from '../../../../../types';

import { IconCalendar } from '../../../../icons';

import { Control } from '../Control/Control';

import styles from './DatepickerInput.scss';

interface DatepickerInputProps extends Testable {
  id: string;
  placeholder?: string;
}

export const DatepickerInput: FC<DatepickerInputProps> = memo(
  ({ dataTest, id, placeholder = '' }) => {
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
          data-test={`${dataTest}-datepicker-input`}
          id={id}
          onBlur={inputBlurHandler}
          onChange={inputChangeHandler}
          onFocus={onFocusHandler}
          placeholder={translate(placeholder) as string}
          value={dateInput}
        />
        <Control
          className={styles.OpenControl}
          dataTest={`${dataTest}-datepicker-expand-button`}
          label={translate('chooseDate') as string}
          expanded={state.show}
          onClick={toggle}
          onFocus={onFocusHandler}
          icon={<IconCalendar action />}
          ref={openButtonRef}
        />
      </div>
    );
  }
);

DatepickerInput.displayName = 'DatepickerInput';
