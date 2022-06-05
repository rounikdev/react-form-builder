import { FC, memo } from 'react';

import { IconContainer } from '../../components';
import { IconProps } from '../../types';

export const IconChevronLeft: FC<IconProps> = memo(({ action, className }) => {
  return (
    <IconContainer action={action} className={className}>
      <polyline points="15 18 9 12 15 6"></polyline>
    </IconContainer>
  );
});

IconChevronLeft.displayName = 'IconChevronLeft';
