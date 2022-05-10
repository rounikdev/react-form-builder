import { FC, memo, useMemo } from 'react';

import { useTextInput } from '@components';
import { useClass } from '@services';
import { Mask } from '../../Mask/Mask';
import { TextProps } from './types';

import { ErrorField } from '../../ErrorField/ErrorField';

import styles from './Text.scss';

export const Text: FC<TextProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    formatter,
    id,
    initialValue,
    label,
    name,
    onBlurSideEffect,
    pattern,
    placeholder,
    required,
    sideEffect,
    type,
    validator
  }) => {
    const {
      errors,
      focused,
      onBlurHandler,
      onChangeHandler,
      onFocusHandler,
      touched,
      valid,
      value
    } = useTextInput({
      dependencyExtractor,
      formatter,
      initialValue,
      name,
      onBlurSideEffect,
      sideEffect,
      validator
    });

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    const containerClass = useClass([styles.Container, className], [className]);

    const inputClass = useClass(
      [styles.Input, pattern && styles.WithMask, isError && styles.Error],
      [isError, pattern]
    );

    return (
      <div className={containerClass}>
        <label data-test={`${dataTest}-label`} className={styles.Label} htmlFor={id}>
          {label}
          <span className={styles.Required}>{required ? 'required' : null}</span>
        </label>
        <div className={styles.InputWrap}>
          <input
            autoComplete="off"
            className={inputClass}
            data-test={`${dataTest}-input`}
            id={id}
            onBlur={onBlurHandler}
            onChange={(event) => {
              onChangeHandler(event.target.value);
            }}
            onFocus={onFocusHandler}
            placeholder={placeholder}
            type={type || 'text'}
            value={value}
          />
          {pattern ? (
            <Mask className={inputClass} focused={focused} pattern={pattern} value={value} />
          ) : null}
        </div>
        <ErrorField errors={errors} isError={isError} />
      </div>
    );
  }
);
