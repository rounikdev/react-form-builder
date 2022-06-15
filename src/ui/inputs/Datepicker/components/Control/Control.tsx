import { FocusEventHandler, forwardRef, memo, MouseEvent, ReactNode } from 'react';

import { Stylable, Testable } from '@types';

interface DatepickerControlProps extends Stylable, Testable {
  describedBy?: string;
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
          aria-expanded={expanded}
          aria-label={label}
          className={className}
          data-test={dataTest}
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
