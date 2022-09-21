import { FC, memo, ReactNode, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useDatepicker, useTranslation } from '@core';
import { Animator } from '@ui/Animator';
import { ErrorField } from '@ui/ErrorField/ErrorField';
import { TabTrap } from '@ui/TabTrap';

import { Calendar, DatepickerInput } from './components';
import { DatepickerProps } from './types';

import styles from './Datepicker.scss';

const shouldAnimate = (currentChildren: ReactNode, newChildren: ReactNode) =>
  !currentChildren || !newChildren;

export const Datepicker: FC<DatepickerProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    disabled,
    id,
    initialValue,
    label = '',
    maxDateExtractor,
    minDateExtractor,
    name,
    placeholder,
    required,
    sideEffect,
    useEndOfDay,
    validator
  }) => {
    const { context, Provider } = useDatepicker({
      dependencyExtractor,
      disabled,
      initialValue,
      label,
      maxDateExtractor,
      minDateExtractor,
      name,
      required,
      sideEffect,
      useEndOfDay,
      validator
    });

    const { translate } = useTranslation();

    const isError = useMemo(
      () => !context.focused && context.touched && !context.valid,
      [context.focused, context.touched, context.valid]
    );

    return (
      <Provider value={context}>
        <div
          className={useClass([styles.Container, className], [className])}
          data-test={`${dataTest}-datepicker-container`}
          ref={context.containerRef}
        >
          <label
            className={useClass([styles.Label, !context.label && styles.NoLabel], [context.label])}
            data-test={`${dataTest}-datepicker-label`}
            htmlFor={id}
          >
            {translate(context.label)}
            <span className={styles.Required}>
              {context.isRequired ? translate('required') : null}
            </span>
          </label>
          <DatepickerInput dataTest={dataTest} id={id} placeholder={placeholder} />
          <Animator
            enterClass={styles.CalendarEnter}
            exitClass={styles.CalendarExit}
            shouldAnimate={shouldAnimate}
          >
            {context.state.show ? (
              <TabTrap active={context.state.show}>
                <Calendar dataTest={dataTest} />
              </TabTrap>
            ) : null}
          </Animator>
          <ErrorField
            dataTest={`error-field-${dataTest}`}
            errors={context.errors}
            isError={isError}
          />
        </div>
      </Provider>
    );
  }
);

Datepicker.displayName = 'Datepicker';
