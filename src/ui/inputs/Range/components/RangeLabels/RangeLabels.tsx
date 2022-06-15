import { FC, memo } from 'react';

import { useRangeContext } from '@core';
import { GlobalModel } from '@services/models/GlobalModel';

import styles from './RangeLabels.scss';

export const RangeLabels: FC = memo(() => {
  const { max, min, options, pixelsPerUnit, value } = useRangeContext();

  return (
    <>
      {options ? (
        options.map((option) => {
          const isSelected = value.from === option || value.to === option;

          return (
            <div
              className={GlobalModel.classer([styles.Option, isSelected && styles.Selected])}
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
