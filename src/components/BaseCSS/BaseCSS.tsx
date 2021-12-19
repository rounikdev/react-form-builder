import { FC, memo } from 'react';

import styles from './BaseCSS.scss';

export const BaseCSS: FC = memo(() => {
  return <div className={styles.Container} />;
});

BaseCSS.displayName = 'BaseCSS';
