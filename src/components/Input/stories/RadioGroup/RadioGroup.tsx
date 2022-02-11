import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@services';

import { useRadioGroup } from '../../useRadioGroup/useRadioGroup';
import { RadioGroupProps } from './types';

import styles from './RadioGroup.scss';

export const RadioGroup: FC<RadioGroupProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    disabled,
    groupLabel,
    id,
    initialValue,
    labelExtractor,
    name,
    options,
    required,
    sideEffect,
    validator,
    valueExtractor
  }) => {
    const { fieldRef, focused, onBlurHandler, onFocusHandler, touched, valid, wrappedOptions } =
      useRadioGroup<string, string>({
        dependencyExtractor,
        initialValue,
        labelExtractor,
        name,
        options,
        sideEffect,
        validator,
        valueExtractor
      });

    const isError = useMemo(() => touched && !focused && !valid, [focused, touched, valid]);

    const containerClassName = useClass([className, styles.Container], [className]);

    const radioClassName = useClass([disabled && styles.Disabled, styles.Input], [disabled]);

    const radioLabelClasses = useClass(
      [disabled && styles.Disabled, focused && styles.Focus, isError && styles.Error, styles.Label],
      [disabled, focused, isError]
    );

    return (
      <div className={containerClassName} data-test={`${dataTest}-radio-group`} role="radiogroup">
        {groupLabel ? <h3>{groupLabel}</h3> : null}
        <div className={styles.InnerContainer}>
          {wrappedOptions.map((option, index) => {
            return (
              <div className={styles.RadioContainer} key={index}>
                <input
                  aria-invalid={!valid}
                  aria-required={required}
                  checked={option.checked}
                  className={radioClassName}
                  data-test={`${dataTest}-${index}-radio-option`}
                  disabled={disabled}
                  id={`${id}-radio-option-${index}`}
                  name={name}
                  onBlur={onBlurHandler}
                  onChange={option.onChangeHandler}
                  onFocus={onFocusHandler}
                  ref={index === 0 ? (fieldRef as MutableRefObject<HTMLInputElement>) : null}
                  type="radio"
                  value={option.value}
                />
                <label
                  className={radioLabelClasses}
                  data-test={`${dataTest}-${index}-radio-option-label`}
                  htmlFor={`${id}-radio-option-${index}`}
                  title={option.label}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
