import { FocusEventHandler, forwardRef, memo, MouseEvent, ReactNode } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { Stylable, Testable } from '@types';

import styles from './Control.scss';

interface DatepickerControlProps extends Stylable, Testable {
  describedBy?: string;
  disabled?: boolean;
  expanded?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: (event: MouseEvent, dataValue?: number) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  tabIndex?: number;
}

export const Control = memo(
  forwardRef<HTMLButtonElement, DatepickerControlProps>(
    (
      {
        className,
        dataTest,
        describedBy,
        disabled,
        expanded,
        icon,
        label,
        onClick,
        onFocus,
        tabIndex = 0,
        ...otherProps
      },
      ref
    ) => {
      return (
        <button
          aria-describedby={describedBy}
          aria-disabled={disabled}
          aria-expanded={expanded}
          aria-label={label}
          className={useClass(
            [styles.Container, disabled && styles.Disabled, className],
            [className, disabled]
          )}
          data-test={dataTest}
          disabled={disabled}
          onClick={onClick}
          onFocus={onFocus}
          ref={ref}
          tabIndex={tabIndex}
          type="button"
          {...otherProps}
        >
          {icon}
        </button>
      );
    }
  )
);

Control.displayName = 'DatepickerControl';
