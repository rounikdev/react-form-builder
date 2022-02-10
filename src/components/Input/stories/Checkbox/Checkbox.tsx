import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@services';

import { useCheckboxInput } from '../../useCheckboxInput/useCheckboxInput';

import { InputCheckboxProps } from './types';

import styles from './Checkbox.scss';

export const Checkbox: FC<InputCheckboxProps> = memo(
  ({
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

    const inputClass = useClass(
      [styles.Input, focused && styles.Focus, isError && styles.Error, disabled && styles.Disabled],
      [focused, isError, disabled]
    );

    const labelClasses = useClass([styles.Label, isError && styles.LabelError], [isError]);

    return (
      <div
        className={useClass(
          [styles.Container, disabled && styles.Disabled, isError && styles.Error],
          [disabled, isError]
        )}
      >
        <div className={styles.InputBox}>
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
              className={labelClasses}
              data-test={`${dataTest}-label`}
              htmlFor={id}
              title={label}
            >
              {label}
            </label>
          ) : null}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
