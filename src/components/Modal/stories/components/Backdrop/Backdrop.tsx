import { FC, memo } from 'react';

import { useClass } from '@services';

import { ModalBackdropProps } from '@components/Modal/types';

import styles from './Backdrop.scss';

const Backdrop: FC<ModalBackdropProps> = ({ children, id, isClosed, props }) => {
  const classes = useClass(
    [styles.Container, styles.EnterAnimation, isClosed && styles.ExitAnimation],
    [isClosed]
  );

  return (
    <div {...props} className={classes} data-test={`${id}-backdrop-modal`}>
      {children}
    </div>
  );
};

Backdrop.displayName = 'ModalBackdrop';

export default memo(Backdrop);
