import { FC, memo } from 'react';

import { IconContainer } from '../../components';
import { IconProps } from '../../types';

export const IconChevronRight: FC<IconProps> = memo(({ action, className, light }) => {
  return (
    <IconContainer action={action} className={className} light={light}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </IconContainer>
  );
});

IconChevronRight.displayName = 'IconChevronRight';
