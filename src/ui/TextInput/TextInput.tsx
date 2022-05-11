import { FC, FocusEvent, memo, MutableRefObject, useMemo } from 'react';
import { useClass } from '@rounik/react-custom-hooks';

import { Field, useField, useTranslation } from '@components';

import styles from './TextInput.scss';

export interface TextInputProps extends Field<string> {
  initialValue?: string;
}

export const TextInput: FC<TextInputProps> = memo(
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
    placeholder,
    required,
    sideEffect,
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
    } = useField<string>({
      dependencyExtractor,
      formatter,
      initialValue: initialValue || '',
      name,
      sideEffect,
      validator
    });

    const { translate } = useTranslation();

    const isError = useMemo(() => touched && !focused && !valid, [focused, touched, valid]);

    return (
      <div
        className={useClass([styles.Container, className], [className])}
        style={{ display: hidden ? 'none' : 'initial' }}
      >
        <label className={styles.Label} htmlFor={id}>
          {label}
        </label>
        <input
          aria-hidden={hidden}
          aria-invalid={!valid}
          aria-required={required}
          autoComplete={autoComplete}
          className={useClass([styles.Input, isError && styles.InputError], [isError])}
          data-test={dataTest}
          disabled={typeof disabled === 'boolean' ? disabled : !isEdit}
          id={id}
          name={name}
          onBlur={(event: FocusEvent<HTMLElement, Element>) => {
            onBlurHandler(event);
          }}
          onChange={(event) => onChangeHandler(event.target.value)}
          onFocus={onFocusHandler}
          placeholder={translate(placeholder || '') as string}
          ref={fieldRef as MutableRefObject<HTMLInputElement>}
          type="text"
          value={value}
        />
        {isError ? <div className={styles.Error}>{errors.map((e) => e.text).join(' ')}</div> : null}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
