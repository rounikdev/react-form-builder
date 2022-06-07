import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useTextInput, useTranslation } from '@components';
import { Mask } from '../../Mask/Mask';
import { TextProps } from './types';

import { ErrorField } from '../../ErrorField/ErrorField';

import styles from './Text.scss';

export const Text: FC<TextProps> = memo(
  ({
    className,
    dataTest,
    dependencyExtractor,
    disabled,
    formatter,
    hidden,
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
      fieldRef,
      focused,
      isEdit,
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

    const { translate } = useTranslation();

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    const containerClass = useClass([styles.Container, className], [className]);

    const inputClass = useClass(
      [styles.Input, pattern && styles.WithMask, isError && styles.Error],
      [isError, pattern]
    );

    return (
      <div className={containerClass} style={{ display: hidden ? 'none' : 'flex' }}>
        <label data-test={`${dataTest}-label`} className={styles.Label} htmlFor={id}>
          {label}
          <span className={styles.Required}>{required ? 'required' : null}</span>
        </label>
        <div className={styles.InputWrap}>
          <input
            aria-hidden={hidden}
            aria-invalid={!valid}
            aria-required={required}
            autoComplete="off"
            className={inputClass}
            data-test={`${dataTest}-input`}
            disabled={typeof disabled === 'boolean' ? disabled : !isEdit}
            id={id}
            name={name}
            onBlur={onBlurHandler}
            onChange={(event) => {
              onChangeHandler(event.target.value);
            }}
            onFocus={onFocusHandler}
            placeholder={translate(placeholder || '') as string}
            ref={fieldRef as MutableRefObject<HTMLInputElement>}
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
