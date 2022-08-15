import { FC, memo } from 'react';

import { HeightTransitionBox, useTranslation, ValidationError } from '@core';
import { Testable } from '@types';

import styles from './ErrorField.scss';

export interface ErrorFieldProps extends Testable {
  errors: ValidationError[];
  isError: boolean;
}

export const ErrorField: FC<ErrorFieldProps> = memo(({ dataTest, errors, isError }) => {
  const { translate } = useTranslation();

  return (
    <HeightTransitionBox dataTest={dataTest} memoizeChildren>
      {isError ? (
        <ul className={styles.Container} data-test={`${dataTest}-errors`}>
          {errors.map((error, index) => (
            <li key={index} className={styles.ErrorMsg}>
              {translate(error.text)}
            </li>
          ))}
        </ul>
      ) : null}
    </HeightTransitionBox>
  );
});

ErrorField.displayName = 'ErrorField';
