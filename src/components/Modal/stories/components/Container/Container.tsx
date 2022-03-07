import { FC, memo } from 'react';

import { ModalContainerProps } from '@components/Modal/types';
import { useClass } from '@services';

import { CloseIcon } from './components';

import styles from './Container.scss';

const Content: FC<ModalContainerProps> = ({ children, id, isClosed, onCloseHandler, props }) => {
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

Content.displayName = 'ModalContent';

export default memo(Content);
