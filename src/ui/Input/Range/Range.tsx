import { FC, memo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useRange } from '@components';
import { Field, RangeOptions, RangeValue } from '../../../components';

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
    dependencyExtractor,
    formatter,
    hideBar,
    initialValue = defaultValue,
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
          onMouseLeave={context.stopMove}
          onMouseMove={context.move}
          onMouseUp={context.stopMove}
        >
          <div
            className={styles.Track}
            onClick={context.onTrackClickHandler}
            ref={context.trackRef}
          >
            {hideBar ? null : <div className={styles.Bar} style={context.barStyle} />}
            <RangeLabels />
            {context.single ? null : <RangeSlider limit={context.limitFrom} name="from" />}
            <RangeSlider limit={context.limitTo} name="to" />
          </div>
        </div>
      </Provider>
    );
  }
);

Range.displayName = 'Range';
