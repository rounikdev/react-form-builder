import { FC, memo } from 'react';

import { HeightTransitionBox, ValidationError } from '../../components';

import styles from './ErrorField.scss';

export interface ErrorFieldProps {
  errors: ValidationError[];
  isError: boolean;
}

export const ErrorField: FC<ErrorFieldProps> = memo(({ errors, isError }) => {
  return (
    <HeightTransitionBox memoizeChildren>
      {isError ? (
        <ul className={styles.Container}>
          {errors.map((error, index) => (
            <li key={index} className={styles.ErrorMsg}>
              {error.text}
            </li>
          ))}
        </ul>
      ) : null}
    </HeightTransitionBox>
  );
});
