import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useRange } from '@core';
import { Field, RangeOptions, RangeValue } from '../../../core';

import { RangeLabels, RangeSlider } from './components';

import styles from './Range.scss';

export interface RangeProps extends Field<RangeValue> {
  hideBar?: boolean;
  initialValue?: RangeValue;
  max?: number;
  min?: number;
  options?: RangeOptions;
  single?: boolean;
  step?: number;
  stepExtra?: number;
}

const defaultValue = { from: 0, to: 0 };

export const Range: FC<RangeProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    formatter,
    hideBar,
    initialValue = defaultValue,
    label,
    max,
    min,
    name,
    onBlur,
    onFocus,
    options,
    sideEffect,
    single,
    step = 1,
    stepExtra = 1,
    validator
  }) => {
    const { context, Provider } = useRange({
      dependencyExtractor,
      formatter,
      initialValue,
      max,
      min,
      name,
      onBlur,
      onFocus,
      options,
      sideEffect,
      single,
      step,
      stepExtra,
      validator
    });

    return (
      <Provider value={context}>
        <div
          className={useClass([styles.Container, className], [className])}
          data-test={`${dataTest}-range-container`}
          onMouseLeave={context.stopMove}
          onMouseMove={context.move}
          onMouseUp={context.stopMove}
        >
          {single ? (
            <h2 aria-live="polite" className={styles.Live}>{`${label} ${context.value.to}`}</h2>
          ) : (
            <h2
              aria-live="polite"
              className={styles.Live}
            >{`${label} from ${context.value.from} to ${context.value.to}`}</h2>
          )}
          <div
            className={styles.Track}
            data-test={`${dataTest}-range-track`}
            onClick={context.onTrackClickHandler}
            ref={context.trackRef}
          >
            {hideBar ? null : (
              <div
                className={styles.Bar}
                data-test={`${dataTest}-range-bar`}
                style={context.barStyle}
              />
            )}
            <RangeLabels />
            {context.single ? null : (
              <RangeSlider
                dataTest={dataTest}
                label={label}
                limit={context.limitFrom}
                name="from"
              />
            )}
            <RangeSlider dataTest={dataTest} label={label} limit={context.limitTo} name="to" />
          </div>
        </div>
      </Provider>
    );
  }
);

Range.displayName = 'Range';
