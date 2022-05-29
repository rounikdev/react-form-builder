import { FC, memo, ReactNode, useCallback, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useDatepicker, useTranslation } from '@components';

import { Animator } from '../../Animator';
import { ErrorField } from '../../ErrorField/ErrorField';

import { Calendar, DatepickerInput } from './components';
import { DatepickerProps } from './types';

import styles from './Datepicker.scss';

const shouldAnimate = (currentChildren: ReactNode, newChildren: ReactNode) =>
  !currentChildren || !newChildren;

export const Datepicker: FC<DatepickerProps> = memo(
  ({
    className,
    dependencyExtractor,
    initialValue,
    id,
    label = '',
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder = '',
    required,
    sideEffect,
    useEndOfDay,
    validator
  }) => {
    const { context, Provider } = useDatepicker({
      dependencyExtractor,
      initialValue,
      maxDateExtractor,
      minDateExtractor,
      name,
      sideEffect,
      useEndOfDay,
      validator
    });

    const { translate } = useTranslation();

    const isError = useMemo(
      () => !context.focused && context.touched && !context.valid,
      [context.focused, context.touched, context.valid]
    );

    const containerOnBlurHandler = useCallback((event) => {
      if (
        event.relatedTarget === null ||
        !context.containerRef.current?.contains(event.relatedTarget)
      ) {
        context.hide();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Provider value={context}>
        <div
          className={useClass([styles.Container, className], [className])}
          onBlur={containerOnBlurHandler}
          ref={context.containerRef}
        >
          <label className={styles.Label} htmlFor={id}>
            {translate(label)}
            <span className={styles.Required}>{required ? translate('required') : null}</span>
          </label>
          <DatepickerInput id={id} placeholder={placeholder} />
          <Animator
            enterClass={styles.CalendarEnter}
            exitClass={styles.CalendarExit}
            shouldAnimate={shouldAnimate}
          >
            {context.state.show ? <Calendar /> : null}
          </Animator>
          <ErrorField errors={context.errors} isError={isError} />
        </div>
      </Provider>
    );
  }
);

Datepicker.displayName = 'Datepicker';
