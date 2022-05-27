import { ChangeEvent, FC, FocusEvent, FocusEventHandler, memo, MouseEvent } from 'react';

import { useTranslation } from '@components';

import { IconCalendar } from '../../../../icons';

import { Control } from '../Control/Control';

import styles from './DatepickerInput.scss';

interface DatepickerInputProps {
  calendarIsOpened: boolean;
  id: string;
  onBlur: (event: FocusEvent) => void;
  onChange: (event: ChangeEvent) => void;
  onFocus: FocusEventHandler<HTMLElement>;
  placeholder?: string;
  toggle: (event: MouseEvent) => void;
  value: string;
}

export const DatepickerInput: FC<DatepickerInputProps> = memo(
  ({ calendarIsOpened, id, onBlur, onChange, onFocus, placeholder = '', toggle, value }) => {
    const { translate } = useTranslation();

    return (
      <div className={styles.Container}>
        <input
          aria-label={value ? '' : 'noDateSelected'}
          autoComplete="off"
          className={styles.Input}
          id={id}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={translate(placeholder) as string}
          value={value}
        />
        <Control
          className={styles.OpenControl}
          tabIndex={0}
          label={translate('chooseDate') as string}
          describedBy={id}
          expanded={calendarIsOpened}
          onClick={toggle}
          icon={<IconCalendar action />}
        />
      </div>
    );
  }
);

DatepickerInput.displayName = 'DatepickerInput';
