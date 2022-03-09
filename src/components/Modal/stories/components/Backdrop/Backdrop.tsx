import { FC, memo } from 'react';

import { ModalBackdropProps } from '@components/Modal/types';

import styles from './Backdrop.scss';

const Backdrop: FC<ModalBackdropProps> = ({ children, id, props }) => {
  return (
    <div {...props} className={styles.Container} data-test={`${id}-backdrop-modal`}>
      {children}
    </div>
  );
};

Backdrop.displayName = 'ModalBackdrop';

export default memo(Backdrop);
