import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useFieldDependency, useTextInput, useTranslation } from '@core';
import { ErrorField } from '@ui/ErrorField/ErrorField';
import { LabelField } from '@ui/LabelField/LabelField';
import { Mask } from '@ui/Mask/Mask';

import { TextProps } from './types';

import styles from './Text.scss';

export const Text: FC<TextProps> = memo(
  ({
    autoComplete = 'off',
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
    placeholder = '',
    required,
    requiredLabel,
    sideEffect,
    type = 'text',
    validator
  }) => {
    const {
      dependencyValue,
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
      initialValue: typeof initialValue === 'undefined' ? '' : initialValue,
      name,
      onBlurSideEffect,
      sideEffect,
      validator
    });

    const dependantData = useFieldDependency({ dependencyValue, disabled, label, required });

    const { translate } = useTranslation();

    const isError = useMemo(() => !focused && touched && !valid, [focused, touched, valid]);

    const containerClassName = useClass([styles.Container, className], [className]);

    const inputClassName = useClass(
      [styles.Input, pattern && styles.WithMask, isError && styles.Error],
      [isError, pattern]
    );

    return (
      <div className={containerClassName} style={{ display: hidden ? 'none' : 'flex' }}>
        <LabelField
          id={id}
          label={dependantData.label}
          required={dependantData.required}
          requiredLabel={requiredLabel}
        />
        <div className={styles.InputWrap}>
          <input
            aria-hidden={hidden}
            aria-invalid={!valid}
            aria-required={dependantData.required}
            autoComplete={autoComplete}
            className={inputClassName}
            data-test={`${dataTest}-input`}
            disabled={
              typeof dependantData.disabled === 'boolean' ? dependantData.disabled : !isEdit
            }
            id={id}
            name={name}
            onBlur={onBlurHandler}
            onChange={(event) => {
              onChangeHandler(event.target.value);
            }}
            onFocus={onFocusHandler}
            placeholder={translate(placeholder) as string}
            ref={fieldRef as MutableRefObject<HTMLInputElement>}
            type={type}
            // The empty string handles the case
            // when undefined is provided
            // (When a function is provided as
            // initialValue and it returns undefined)
            value={value ?? ''}
          />
          {pattern ? (
            <Mask className={inputClassName} focused={focused} pattern={pattern} value={value} />
          ) : null}
        </div>
        <ErrorField dataTest={`error-field-${dataTest}`} errors={errors} isError={isError} />
      </div>
    );
  }
);

Text.displayName = 'Text';
