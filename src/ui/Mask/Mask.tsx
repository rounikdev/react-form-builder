import { FC, memo, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import styles from './Mask.scss';

export interface IMaskProps {
  className: string;
  dataTest?: string;
  focused: boolean;
  pattern: string;
  value: string;
}

export const Mask: FC<IMaskProps> = memo(({ className, dataTest, focused, pattern, value }) => {
  const maskTxt = useMemo(
    () =>
      Array.from(pattern).reduce((accum, char, index) => {
        if (!value || !value[index]) {
          accum += char;
        } else {
          accum += value[index];
        }

        return accum;
      }, ''),
    [pattern, value]
  );

  return (
    <div
      className={useClass(
        [styles.Mask, focused && styles.Focused, className],
        [className, focused]
      )}
    >
      <span className={styles.MaskTxt} data-test={`${dataTest}-mask-text`}>
        {maskTxt}
      </span>
    </div>
  );
});

Mask.displayName = 'Mask';
