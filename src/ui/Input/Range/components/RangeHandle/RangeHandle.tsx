/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, memo, MouseEventHandler, useCallback, useEffect, useMemo, useRef } from 'react';

import { RangeHandleProps } from '../../types';

import styles from './RangeHandle.scss';

export const RangeHandle: FC<RangeHandleProps> = memo(
  ({
    clientX,
    isMoving,
    limit,
    min,
    name,
    onBlur,
    onChange,
    onFocus,
    options,
    pixelsPerUnit,
    setIsMoving,
    unitsPerPixel,
    value
  }) => {
    const x = useRef(0);

    const style = useMemo(() => {
      return { left: (value[name] - (min || 0)) * pixelsPerUnit };
    }, [min, name, pixelsPerUnit, value]);

    const startMove: MouseEventHandler = useCallback(
      (event) => {
        x.current = event.clientX;
        setIsMoving((prevState) => ({
          ...prevState,
          [name]: true
        }));
      },
      [name, setIsMoving]
    );

    useEffect(() => {
      const newX = clientX;

      const deltaPixels = newX - x.current;

      x.current = newX;

      if (isMoving[name]) {
        const deltaUnits = deltaPixels * unitsPerPixel;

        const newValue = value[name] + deltaUnits;

        onChange({
          ...value,
          [name]: limit(newValue)
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientX, isMoving, limit, name, onChange, unitsPerPixel]);

    return (
      <div
        aria-label={name}
        aria-valuenow={value[name]}
        aria-valuetext={value[name]?.toString() || ''}
        className={styles.Container}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={({ code }) => {
          const val = value[name];
          switch (code) {
            case 'ArrowRight':
              if (options) {
                const option = options.find((option) => option > val);

                if (typeof option !== 'undefined') {
                  onChange({
                    ...value,
                    [name]: limit(option)
                  });
                }
              } else {
                onChange({
                  ...value,
                  [name]: limit(val + 1)
                });
              }

              break;
            case 'ArrowLeft':
              if (options) {
                const option = [...options].reverse().find((option) => option < val);

                if (typeof option !== 'undefined') {
                  onChange({
                    ...value,
                    [name]: limit(option)
                  });
                }
              } else {
                onChange({
                  ...value,
                  [name]: limit(val - 1)
                });
              }

              break;
            default:
              break;
          }
        }}
        onMouseDown={startMove}
        role="slider"
        style={style}
        tabIndex={0}
      >
        {options ? null : <div className={styles.Value}>{value[name]}</div>}
      </div>
    );
  }
);

RangeHandle.displayName = 'RangeHandle';
