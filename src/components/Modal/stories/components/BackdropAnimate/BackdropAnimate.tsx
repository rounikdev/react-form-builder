import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { ModalBackdropProps } from '@components/Modal/types';

import styles from './BackdropAnimate.scss';

const BackdropAnimate: FC<ModalBackdropProps> = ({ children, id, isClosed, props }) => {
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

BackdropAnimate.displayName = 'ModalBackdropAnimate';

export default memo(BackdropAnimate);
