import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@services';

import { useInput } from '../../useInput/useInput';
import { InputPrimaryProps } from '../types';

import styles from './Primary.scss';

export const Primary: FC<InputPrimaryProps> = memo(
  ({
    autoComplete = 'off',
    dataTest,
    dependencyExtractor,
    disabled,
    formatter,
    id,
    initialValue = '',
    name,
    onBlurSideEffect,
    placeholder,
    required,
    sideEffect,
    type,
    validator
  }) => {
    const {
      errors,
      fieldRef,
      focused,
      onBlurHandler,
      onChangeHandler,
      onFocusHandler,
      touched,
      valid,
      value
    } = useInput({
      dependencyExtractor,
      disabled,
      formatter,
      initialValue,
      name,
      onBlurSideEffect,
      sideEffect,
      validator
    });

    const isError = useMemo(() => touched && !focused && !valid, [focused, touched, valid]);

    const inputClass = useClass(
      [styles.Input, focused && styles.Focus, isError && styles.Error, disabled && styles.Disabled],
      [focused, isError, disabled]
    );

    return (
      <div className={styles.Container}>
        <input
          aria-invalid={!valid}
          aria-required={required}
          autoComplete={autoComplete}
          className={inputClass}
          data-test={`${dataTest}-input`}
          disabled={disabled}
          id={id}
          name={name}
          onBlur={onBlurHandler}
          onChange={(event) => onChangeHandler(event.target.value)}
          onFocus={onFocusHandler}
          placeholder={placeholder}
          ref={fieldRef as MutableRefObject<HTMLInputElement>}
          type={type}
          value={value}
        />
      </div>
    );
  }
);
