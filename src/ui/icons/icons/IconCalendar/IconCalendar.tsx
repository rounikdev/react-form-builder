import { FC, memo } from 'react';

import { IconContainer } from '../../components';
import { IconProps } from '../../types';

export const IconCalendar: FC<IconProps> = memo(({ action, className, light }) => {
  return (
    <IconContainer action={action} className={className} light={light}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </IconContainer>
  );
});

IconCalendar.displayName = 'IconCalendar';
