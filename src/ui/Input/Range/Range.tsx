import {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useClass, useMount, useUpdate } from '@rounik/react-custom-hooks';

import { useField } from '@components';

import { RangeHandle } from './components';
import { RangeProps, RangeValue } from './types';

import styles from './Range.scss';

const defaultValue = { from: 0, to: 0 };

export const Range: FC<RangeProps> = memo(
  ({
    className,
    dependencyExtractor,
    formatter,
    initialValue = defaultValue,
    max: maximum,
    min: minimum,
    name,
    onBlur,
    onFocus,
    options,
    sideEffect,
    validator
  }) => {
    const { onBlurHandler, onChangeHandler, onFocusHandler, value } = useField<RangeValue>({
      dependencyExtractor,
      formatter,
      initialValue,
      name,
      onBlur,
      onFocus,
      sideEffect,
      validator
    });

    const { min, max } = useMemo(() => {
      const limits = {
        max: maximum,
        min: minimum
      };
      if (Array.isArray(options) && options.length > 1) {
        limits.max = options[options.length - 1];
        limits.min = options[0];
      }

      return limits;
    }, [maximum, minimum, options]);

    const element = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);

    const [isMoving, setIsMoving] = useState({
      from: false,
      to: false
    });

    const [clientX, setClientX] = useState(0);

    const unitsPerPixel = useMemo(() => {
      return typeof max === 'undefined' || typeof min === 'undefined' ? 0 : (max - min) / width;
    }, [max, min, width]);

    const pixelsPerUnit = useMemo(() => {
      return typeof max === 'undefined' || typeof min === 'undefined' ? 0 : width / (max - min);
    }, [max, min, width]);

    const barStyle = useMemo(() => {
      return {
        left: (value.from - (min || 0)) * pixelsPerUnit,
        width: (value.to - value.from) * pixelsPerUnit
      };
    }, [min, pixelsPerUnit, value.from, value.to]);

    const limitFrom = useCallback(
      (from: number) => {
        if (typeof min === 'undefined') {
          return from;
        } else if (from < min) {
          return min;
        } else if (from > value.to) {
          return value.to as number;
        } else {
          return from;
        }
      },
      [min, value.to]
    );

    const limitTo = useCallback(
      (to: number) => {
        if (typeof max === 'undefined') {
          return to;
        } else if (to > max) {
          return max;
        } else if (to < value.from) {
          return value.from as number;
        } else {
          return to;
        }
      },
      [max, value.from]
    );

    const limitToOptions = useCallback(
      (val: number) => {
        let newVal = val;

        if (options?.length) {
          let smaller = null;
          let bigger = null;

          for (let i = 0; i < options.length; i++) {
            if (options[i] === val) {
              return newVal;
            } else if (options[i] < val) {
              smaller = options[i];
            } else {
              bigger = options[i];
              break;
            }
          }

          if (smaller && Math.abs(val - smaller) <= Math.abs(val - (bigger || 0))) {
            newVal = smaller;
          } else if (bigger !== null) {
            newVal = bigger;
          }
        }

        return newVal;
      },
      [options]
    );

    const stopMove = useCallback(() => {
      setIsMoving(() => ({
        from: false,
        to: false
      }));

      if (options) {
        onChangeHandler({
          from: limitToOptions(value.from),
          to: limitToOptions(value.to)
        });
      }
    }, [limitToOptions, onChangeHandler, options, value]);

    const onTrackClickHandler = useCallback(
      (event: MouseEvent) => {
        const left = event.nativeEvent.clientX - (element.current?.offsetLeft || 0);

        const clickValue = (min || 0) + left * unitsPerPixel;
        const deltaFrom = Math.abs(value.from - clickValue);
        const deltaTo = Math.abs(value.to - clickValue);

        if (deltaFrom < deltaTo) {
          onChangeHandler({
            ...value,
            from: options ? limitToOptions(limitFrom(clickValue)) : limitFrom(clickValue)
          });
        } else {
          onChangeHandler({
            ...value,
            to: options ? limitToOptions(limitTo(clickValue)) : limitTo(clickValue)
          });
        }
      },
      [limitFrom, limitTo, limitToOptions, min, onChangeHandler, options, unitsPerPixel, value]
    );

    const move = useCallback((event) => {
      setClientX(event.clientX);
    }, []);

    useLayoutEffect(() => {
      if (element.current) {
        setWidth(element.current.offsetWidth);
      }
    }, []);

    useMount(() => {
      if (options) {
        onChangeHandler({
          from: limitToOptions(value.from),
          to: limitToOptions(value.to)
        });
      }
    });

    useUpdate(() => {
      if (options) {
        onChangeHandler({
          from: limitToOptions(initialValue.from),
          to: limitToOptions(initialValue.to)
        });
      }
    }, [initialValue]);

    return (
      <div className={styles.Container} onMouseMove={move} onMouseUp={stopMove}>
        <div
          className={useClass([styles.Track, className], [className])}
          onClick={onTrackClickHandler}
          ref={element}
        >
          {options
            ? options.map((option) => {
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
            : null}
          <div className={styles.Bar} style={barStyle} />
          {options ? null : (
            <>
              <div className={styles.Min}>{min}</div>
              <div className={styles.Max}>{max}</div>
            </>
          )}
          <RangeHandle
            clientX={clientX}
            isMoving={isMoving}
            limit={limitFrom}
            min={min}
            name="from"
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            onFocus={onFocusHandler}
            options={options}
            pixelsPerUnit={pixelsPerUnit}
            setIsMoving={setIsMoving}
            unitsPerPixel={unitsPerPixel}
            value={value}
          />
          <RangeHandle
            clientX={clientX}
            isMoving={isMoving}
            limit={limitTo}
            min={min}
            name="to"
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            onFocus={onFocusHandler}
            options={options}
            pixelsPerUnit={pixelsPerUnit}
            setIsMoving={setIsMoving}
            unitsPerPixel={unitsPerPixel}
            value={value}
          />
        </div>
      </div>
    );
  }
);

Range.displayName = 'Range';
