import {
  FocusEventHandler,
  forwardRef,
  ForwardRefExoticComponent,
  memo,
  MouseEvent,
  ReactNode,
  RefAttributes
} from 'react';

import { Stylable } from '../../../../../types';

interface DatepickerControlProps extends Stylable {
  describedBy?: string;
  expanded?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: (event: MouseEvent, dataValue?: number) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  tabIndex?: number;
}

export const Control: ForwardRefExoticComponent<
  DatepickerControlProps & RefAttributes<HTMLButtonElement>
> = memo(
  forwardRef<HTMLButtonElement, DatepickerControlProps>(
    (
      {
        className,
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
