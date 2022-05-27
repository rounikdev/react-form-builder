import { FC, memo, MouseEvent, ReactNode } from 'react';

import { Stylable } from '../../../../../types';

interface DatepickerControlProps extends Stylable {
  describedBy?: string;
  expanded?: boolean;
  icon?: ReactNode;
  label?: string;
  onClick: (event: MouseEvent, dataValue?: number) => void;
  tabIndex?: number;
}

export const Control: FC<DatepickerControlProps> = memo(
  ({ className, describedBy, expanded, icon, label, onClick, tabIndex = 0, ...otherProps }) => {
    return (
      <button
        aria-describedby={describedBy}
        aria-expanded={expanded}
        aria-label={label}
        className={className}
        onClick={onClick}
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
