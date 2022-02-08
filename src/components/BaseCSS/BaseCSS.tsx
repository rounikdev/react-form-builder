import { FC, memo } from 'react';

import styles from './BaseCSS.scss';

export const BaseCSS: FC = memo(() => {
  return <div data-test="base-css" className={styles.Container} />;
});

BaseCSS.displayName = 'BaseCSS';
