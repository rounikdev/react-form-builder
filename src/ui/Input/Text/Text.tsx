import { FC, memo, MutableRefObject, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useTextInput, useTranslation } from '@components';
import { Mask } from '../../Mask/Mask';
import { TextProps } from './types';

import { ErrorField } from '../../ErrorField/ErrorField';
import { LabelField } from '../../LabelField/LabelField';

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

    const containerClassName = useClass([styles.Container, className], [className]);

    const inputClassName = useClass(
      [styles.Input, pattern && styles.WithMask, isError && styles.Error],
      [isError, pattern]
    );

    return (
      <div className={containerClassName} style={{ display: hidden ? 'none' : 'flex' }}>
        <LabelField id={id} label={label} required={required} requiredLabel={requiredLabel} />
        <div className={styles.InputWrap}>
          <input
            aria-hidden={hidden}
            aria-invalid={!valid}
            aria-required={required}
            autoComplete={autoComplete}
            className={inputClassName}
            data-test={`${dataTest}-input`}
            disabled={typeof disabled === 'boolean' ? disabled : !isEdit}
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
            value={value}
          />
          {pattern ? (
            <Mask className={inputClassName} focused={focused} pattern={pattern} value={value} />
          ) : null}
        </div>
        <ErrorField errors={errors} isError={isError} />
      </div>
    );
  }
);

Text.displayName = 'Text';
