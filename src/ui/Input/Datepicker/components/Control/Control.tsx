import { ComponentType, FC, memo, MouseEvent, ReactNode } from 'react';

import { Stylable } from '../../../../../types';

interface DatepickerControlProps extends Stylable {
  dataValue?: number;
  describedBy?: string;
  expanded?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: (event: MouseEvent, dataValue?: number) => void;
  tabIndex: number;
  tag?: ComponentType;
}

export const Control: FC<DatepickerControlProps> = memo(
  ({
    className,
    dataValue,
    describedBy,
    expanded,
    icon,
    label,
    onClick,
    tabIndex,
    ...otherProps
  }) => {
    return (
      <button
        aria-describedby={describedBy}
        aria-expanded={expanded}
        aria-label={label}
        className={className}
        onClick={(event: MouseEvent) => onClick(event, dataValue)}
        tabIndex={tabIndex}
        type="button"
        {...otherProps}
      >
        {icon}
      </button>
    );
  }
);

Control.displayName = 'DatepickerControl';
