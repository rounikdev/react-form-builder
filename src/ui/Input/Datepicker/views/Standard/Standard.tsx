import { FC, memo } from 'react';

import { DatepickerProps } from '../../types';
import Datepicker from '../../Datepicker';

import styles from './Standard.scss';

export const Standard: FC<DatepickerProps> = memo((props) => {
  return <Datepicker {...props} className={styles.Container} />;
});

Standard.displayName = 'StandardDatepicker';
