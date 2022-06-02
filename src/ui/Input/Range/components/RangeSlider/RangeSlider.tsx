import {
  FC,
  KeyboardEventHandler,
  memo,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef
} from 'react';

import { useUpdate } from '@rounik/react-custom-hooks';

import { useRangeContext } from '@components';

import styles from './RangeSlider.scss';

interface RangeSliderProps {
  limit: (value: number) => number;
  name: 'from' | 'to';
}

export const RangeSlider: FC<RangeSliderProps> = memo(({ limit, name }) => {
  const {
    clientX,
    isMoving,
    min,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    options,
    pixelsPerUnit,
    setIsMoving,
    step,
    stepExtra,
    unitsPerPixel,
    value
  } = useRangeContext();

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

  const onKeyDownHandler: KeyboardEventHandler = useCallback(
    ({ code }) => {
      const val = value[name];
      switch (code) {
        case 'ArrowRight':
          if (options) {
            const option = options.find((option) => option > val);

            if (typeof option !== 'undefined') {
              onChangeHandler({
                ...value,
                [name]: limit(option)
              });
            }
          } else {
            onChangeHandler({
              ...value,
              [name]: limit(val + step)
            });
          }

          break;
        case 'ArrowLeft':
          if (options) {
            const option = [...options].reverse().find((option) => option < val);

            if (typeof option !== 'undefined') {
              onChangeHandler({
                ...value,
                [name]: limit(option)
              });
            }
          } else {
            onChangeHandler({
              ...value,
              [name]: limit(val - step)
            });
          }

          break;
        case 'ArrowUp':
          if (!options) {
            onChangeHandler({
              ...value,
              [name]: limit(val + stepExtra)
            });
          }

          break;
        case 'ArrowDown':
          if (!options) {
            onChangeHandler({
              ...value,
              [name]: limit(val - stepExtra)
            });
          }

          break;
        default:
          break;
      }
    },
    [limit, name, onChangeHandler, options, step, stepExtra, value]
  );

  useUpdate(() => {
    const newX = clientX;

    const deltaPixels = newX - x.current;

    x.current = newX;

    if (isMoving[name]) {
      const deltaUnits = deltaPixels * unitsPerPixel;

      const newValue = value[name] + deltaUnits;

      onChangeHandler({
        ...value,
        [name]: limit(newValue)
      });
    }
  }, [clientX, isMoving, limit, name, onChangeHandler, unitsPerPixel]);

  return (
    <div
      aria-label={name}
      aria-valuenow={value[name]}
      aria-valuetext={value[name]?.toString() || ''}
      className={styles.Container}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
      onKeyDown={onKeyDownHandler}
      onMouseDown={startMove}
      role="slider"
      style={style}
      tabIndex={0}
    >
      {options ? null : <div className={styles.Value}>{value[name]}</div>}
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';
