import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { IconContainerProps } from '../../types';

import styles from './IconContainer.scss';

export const IconContainer: FC<IconContainerProps> = memo(
  ({ action, children, className, light }) => {
    return (
      <div
        className={useClass(
          [styles.Container, action && styles.Action, className],
          [action, className]
        )}
      >
        <svg
          className={useClass([styles.Icon, light && styles.Light], [light])}
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </svg>
      </div>
    );
  }
);

IconContainer.displayName = 'IconContainer';
