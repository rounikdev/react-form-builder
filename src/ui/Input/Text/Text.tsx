import { FC, memo, useMemo } from 'react';

import { useField } from '@components/Form';
import { useClass } from '@services';
import { Mask } from '../../Mask/Mask';
import { TextProps } from './types';

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
    pattern,
    placeholder,
    required,
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
    } = useField({
      dependencyExtractor,
      formatter,
      initialValue: initialValue ?? '',
      name,
      validator
    });

    const showError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    const inputClass = useClass(
      [styles.Input, pattern && styles.WithMask, showError && styles.Error],
      [pattern, showError]
    );

    return (
      <div className={useClass([styles.Container, className], [className])}>
        {pattern ? (
          <Mask className={inputClass} focused={focused} pattern={pattern} value={value} />
        ) : null}
        <label data-test={`${dataTest}-label`} className={styles.Label} htmlFor={id}>
          {label}
          <span className={styles.Required}>{required ? 'required' : null}</span>
        </label>
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
        {showError ? (
          <ul className={styles.ErrorContainer}>
            {errors.map((error, index) => (
              <li key={index} className={styles.ErrorMsg}>
                {error}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
);
