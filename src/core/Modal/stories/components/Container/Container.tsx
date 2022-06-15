import { FC, memo } from 'react';

import { ModalContainerProps } from '@core/Modal/types';

import { CloseIcon } from '../components';

import styles from './Container.scss';

const Container: FC<ModalContainerProps> = ({ children, id, onCloseHandler, props }) => {
  return (
    <section {...props} className={styles.Container} data-test={`${id}-container-modal`}>
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

Container.displayName = 'ModalContainer';

export default memo(Container);
