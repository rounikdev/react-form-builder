import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { ModalContainerProps } from '@core/Modal/types';

import { CloseIcon } from '../components';

import styles from './ContainerAnimate.scss';

const ContainerAnimate: FC<ModalContainerProps> = ({
  children,
  id,
  isClosed,
  onCloseHandler,
  props
}) => {
  const classes = useClass(
    [styles.Container, styles.EnterAnimation, isClosed && styles.ExitAnimation],
    [isClosed]
  );

  return (
    <section {...props} className={classes} data-test={`${id}-container-modal`}>
      <button
        className={styles.CloseBtn}
        data-test={`${id}-close-modal`}
        onClick={onCloseHandler}
        type="button"
      >
        <CloseIcon />
      </button>
      {children}
    </section>
  );
};

ContainerAnimate.displayName = 'ModalContainerAnimate';

export default memo(ContainerAnimate);
