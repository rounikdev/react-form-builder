import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useTranslation } from '@components';

import { LabelFieldProps } from './types';

import styles from './LabelField.scss';

export const LabelField: FC<LabelFieldProps> = memo(
  ({ dataTest, id, label = '', noLabelTruncate, required, requiredLabel = 'requiredField' }) => {
    const { translate } = useTranslation();

    const labelClassName = useClass(
      [styles.Label, noLabelTruncate && styles.NoLabelTruncate],
      [noLabelTruncate]
    );

    const requiredClassName = useClass(
      [styles.Required, noLabelTruncate && styles.NoLabelTruncate],
      [noLabelTruncate]
    );

    return (
      <div className={styles.Container}>
        <div className={styles.Content}>
          <label
            className={labelClassName}
            data-test={`${dataTest}-label`}
            htmlFor={id}
            id={`${id}-label`}
            title={translate(label) as string}
          >
            {translate(label)}
          </label>
          {required ? (
            <span
              className={requiredClassName}
              data-test={`${dataTest}-required`}
              title={translate(requiredLabel) as string}
            >
              {translate(requiredLabel)}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

LabelField.displayName = 'LabelField';
