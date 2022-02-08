import { FC, FocusEvent, memo, MutableRefObject, useMemo } from 'react';

import { Field, useField, UseFieldConfig, useTranslation } from '@components';
import { useClass } from '@services';

export interface TextInputProps
  extends Omit<UseFieldConfig<string>, 'initialValue'>,
    Omit<Field, 'dataTest'> {
  autoComplete?: string;
  className?: string;
  initialValue?: string;
  type?: string;
}
export const TextInput: FC<TextInputProps> = memo(
  ({
    autoComplete = 'off',
    className,
    dependencyExtractor,
    disabled,
    formatter,
    id,
    initialValue,
    label,
    name,
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
      <div className={useClass([className], [className])}>
        <label htmlFor={id}>{label}</label>
        <input
          aria-invalid={!valid}
          aria-required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          name={name}
          onBlur={(event: FocusEvent<HTMLElement, Element>) => {
            onBlurHandler(event);
          }}
          onChange={(event) => onChangeHandler(event.target.value)}
          onFocus={onFocusHandler}
          placeholder={translate(placeholder || '') as string}
          ref={fieldRef as MutableRefObject<HTMLInputElement>}
          type={type}
          value={value}
        />
        {isError ? <div>{JSON.stringify(errors)}</div> : null}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
