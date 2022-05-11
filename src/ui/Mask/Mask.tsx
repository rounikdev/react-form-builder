import { FC, memo, useMemo } from 'react';
import { useClass } from '@rounik/react-custom-hooks';

import styles from './Mask.scss';

export interface IMaskProps {
  className: string;
  focused: boolean;
  pattern: string;
  value: string;
}

export const Mask: FC<IMaskProps> = memo(({ className, focused, pattern, value }) => {
  const maskTxt = useMemo(() => {
    const maskTxt = Array.from(pattern).reduce((accum, char, index) => {
      if (!value || !value[index]) {
        accum += char;
      } else {
        accum += value[index];
      }

      return accum;
    }, '');

    return maskTxt;
  }, [pattern, value]);

  return (
    <div
      className={useClass(
        [styles.Mask, focused && styles.Focused, className],
        [className, focused]
      )}
    >
      <span className={styles.MaskTxt}>{maskTxt}</span>
    </div>
  );
});
