import {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { useMount, useUpdate } from '@rounik/react-custom-hooks';

import { useField } from '@core/Form/hooks';

import { rangeContext } from './context';
import { RangeValue, UseRangeArgs } from './types';

export const useRange = ({
  dependencyExtractor,
  formatter,
  initialValue,
  max: maximum,
  min: minimum,
  name,
  onBlur,
  onFocus,
  options,
  sideEffect,
  single,
  step,
  stepExtra,
  validator
}: UseRangeArgs) => {
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

  const trackRef = useRef<HTMLDivElement>(null);

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
      } else if (to < ((single ? min : value.from) ?? value.from)) {
        return (single ? min : value.from) ?? value.from;
      } else {
        return to;
      }
    },
    [max, min, single, value.from]
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
      const left = event.clientX - (trackRef.current?.offsetLeft || 0);

      const clickValue = (min || 0) + left * unitsPerPixel;
      const deltaFrom = Math.abs(value.from - clickValue);
      const deltaTo = Math.abs(value.to - clickValue);

      if (single) {
        onChangeHandler({
          ...value,
          to: options ? limitToOptions(clickValue) : limitTo(clickValue)
        });
      } else {
        if (deltaFrom < deltaTo) {
          onChangeHandler({
            ...value,
            from: options ? limitToOptions(clickValue) : limitFrom(clickValue)
          });
        } else {
          onChangeHandler({
            ...value,
            to: options ? limitToOptions(clickValue) : limitTo(clickValue)
          });
        }
      }
    },
    [
      limitFrom,
      limitTo,
      limitToOptions,
      min,
      onChangeHandler,
      options,
      single,
      unitsPerPixel,
      value
    ]
  );

  const move: MouseEventHandler = useCallback((event) => {
    setClientX(event.clientX);
  }, []);

  useLayoutEffect(() => {
    if (trackRef.current) {
      setWidth(trackRef.current.offsetWidth);
    }
  }, []);

  useMount(() => {
    if (options) {
      onChangeHandler({
        from: limitToOptions(value.from),
        to: limitToOptions(value.to)
      });
    } else {
      onChangeHandler({
        from: limitFrom(value.from),
        to: limitTo(value.to)
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

  const context = useMemo(
    () => ({
      barStyle,
      clientX,
      isMoving,
      limitFrom,
      limitTo,
      max,
      min,
      move,
      onBlurHandler,
      onChangeHandler,
      onFocusHandler,
      onTrackClickHandler,
      options,
      pixelsPerUnit,
      setIsMoving,
      single,
      step,
      stepExtra,
      stopMove,
      trackRef,
      unitsPerPixel,
      value
    }),
    [
      barStyle,
      clientX,
      isMoving,
      limitFrom,
      limitTo,
      max,
      min,
      move,
      onBlurHandler,
      onChangeHandler,
      onFocusHandler,
      onTrackClickHandler,
      options,
      pixelsPerUnit,
      single,
      step,
      stepExtra,
      stopMove,
      unitsPerPixel,
      value
    ]
  );

  return {
    context,
    Provider: rangeContext.Provider
  };
};
