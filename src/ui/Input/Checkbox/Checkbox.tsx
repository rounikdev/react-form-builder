import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useCheckboxInput } from '@components';
import { useClass } from '@services';

import { CheckboxProps } from './types';

import styles from './Checkbox.scss';

export const Checkbox: FC<CheckboxProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    disabled,
    id,
    initialValue,
    label,
    name,
    required,
    sideEffect,
    validator
  }) => {
    const {
      fieldRef,
      focused,
      onBlurHandler,
      onChangeHandler,
      onFocusHandler,
      touched,
      valid,
      value
    } = useCheckboxInput({
      dependencyExtractor,
      initialValue,
      name,
      sideEffect,
      validator
    });

    const isError = useMemo(() => touched && !focused && !valid, [focused, touched, valid]);

    const containerClass = useClass(
      [styles.Container, className, disabled && styles.Disabled, isError && styles.Error],
      [className, disabled, isError]
    );

    const inputClass = useClass(
      [styles.Input, focused && styles.Focus, isError && styles.Error, disabled && styles.Disabled],
      [focused, isError, disabled]
    );

    return (
      <div className={containerClass}>
        <div className={styles.InputWrap}>
          <input
            aria-required={required}
            checked={value}
            className={inputClass}
            data-test={`${dataTest}-input`}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={onBlurHandler}
            onChange={() => onChangeHandler(!value)}
            onFocus={onFocusHandler}
            ref={fieldRef as MutableRefObject<HTMLInputElement>}
            type="checkbox"
          />
          <span className={styles.Checkmark} />
        </div>
        <div className={styles.LabelContainer}>
          {label ? (
            <label
              className={styles.Label}
              data-test={`${dataTest}-label`}
              htmlFor={id}
              title={label}
            >
              {required ? '*' : null}
              {label}
            </label>
          ) : null}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
