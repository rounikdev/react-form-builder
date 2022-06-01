import { FC, memo } from 'react';

import { useRangeContext } from '@components';

import styles from './RangeLabels.scss';

export const RangeLabels: FC = memo(() => {
  const { max, min, options, pixelsPerUnit } = useRangeContext();

  return (
    <>
      {options ? (
        options.map((option) => {
          return (
            <div
              className={styles.Option}
              key={option}
              style={{
                left: (option - (min || 0)) * pixelsPerUnit
              }}
            >
              {option}
            </div>
          );
        })
      ) : (
        <>
          <div className={styles.Min}>{min}</div>
          <div className={styles.Max}>{max}</div>
        </>
      )}
    </>
  );
});

RangeLabels.displayName = 'RangeLabels';
