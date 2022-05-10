import { FC, memo } from 'react';

import { HeightTransitionBoxAuto, ValidationError } from '../../components';

import styles from './ErrorField.scss';

export interface ErrorFieldProps {
  errors: ValidationError[];
  isError: boolean;
}

export const ErrorField: FC<ErrorFieldProps> = memo(({ errors, isError }) => {
  return (
    <HeightTransitionBoxAuto memoizeChildren>
      {isError ? (
        <ul className={styles.Container}>
          {errors.map((error, index) => (
            <li key={index} className={styles.ErrorMsg}>
              {error.text}
            </li>
          ))}
        </ul>
      ) : null}
    </HeightTransitionBoxAuto>
  );
});
