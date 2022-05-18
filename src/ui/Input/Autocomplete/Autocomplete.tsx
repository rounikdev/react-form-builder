import { LegacyRef, memo, PropsWithChildren, RefObject, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useAutocomplete } from '@components';

import { ErrorField } from '../../ErrorField/ErrorField';

import { AutocompleteProps } from './types';

import styles from './Autocomplete.scss';

const BaseAutocomplete = <T,>({
  autocomplete,
  children,
  className,
  dataTest,
  dependencyExtractor,
  disabled,
  extractId,
  extractLabel,
  formatter,
  id,
  initialValue,
  label,
  list,
  multi = false,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}: PropsWithChildren<AutocompleteProps<T>>) => {
  const {
    close,
    context,
    errors,
    fieldRef,
    filteredList,
    focused: isFocused,
    focusedId,
    onBlurHandler,
    onFocusHandler,
    open,
    Provider,
    search,
    select,
    selected,
    setSearch,
    show,
    touched,
    valid,
    wrapperRef
  } = useAutocomplete<T>({
    dependencyExtractor,
    extractId,
    extractLabel,
    formatter,
    initialValue,
    list,
    multi,
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });

  const listboxContainerClasses = useClass(
    [styles.ListBoxContainer, !show && styles.Closed],
    [show]
  );

  const isError = useMemo(
    () => !isFocused && touched && !valid && !disabled,
    [disabled, isFocused, touched, valid]
  );

  return (
    <Provider value={context}>
      <div
        aria-expanded={show}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        className={useClass([styles.Container, className], [className])}
        data-test={`${dataTest}-container`}
        ref={wrapperRef as RefObject<HTMLDivElement>}
        role="combobox"
        onBlur={(event) => {
          if (event.relatedTarget === null || !wrapperRef.current?.contains(event.relatedTarget)) {
            close();
          }
        }}
        onFocus={onFocusHandler}
      >
        {multi ? (
          <ul className={styles.MultiOptionList}>
            {selected
              .map((optionId) => {
                return list.find((item) => extractId(item) === optionId);
              })
              .map((option) => {
                return option ? (
                  <li className={styles.MultiOption} key={extractId(option)}>
                    {extractLabel(option)}{' '}
                    <button
                      className={styles.RemoveMultiOption}
                      onClick={() => {
                        select(extractId(option));
                        onBlurHandler();
                      }}
                    >
                      x
                    </button>
                  </li>
                ) : null;
              })}
          </ul>
        ) : null}
        <label id={`${id}-label`} htmlFor={`${id}-textbox`}>
          {label}
        </label>
        <input
          autoComplete="off"
          {...(focusedId ? { 'aria-activedescendant': `${focusedId}-option` } : {})}
          {...(show ? { 'aria-controls': `${id}-listbox` } : {})}
          className={useClass([styles.Input, isError && styles.Error], [isError])}
          disabled={disabled}
          id={`${id}-textbox`}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          onFocus={open}
          type="text"
          value={show && autocomplete ? search : selected.join(', ')}
          readOnly={!autocomplete}
          ref={fieldRef as LegacyRef<HTMLInputElement>}
        />
        {show ? (
          <div className={listboxContainerClasses} role="none" tabIndex={0}>
            <ul
              aria-labelledby={`${id}-label`}
              {...(multi ? { 'aria-multiselectable': true } : {})}
              className={styles.ListBox}
              data-test={`${dataTest}-listbox`}
              id={`${id}-listbox`}
              role="listbox"
            >
              {children({ options: filteredList })}
            </ul>
          </div>
        ) : null}
        <ErrorField errors={errors} isError={isError} />
      </div>
    </Provider>
  );
};

type AutocompleteType = typeof BaseAutocomplete & { displayName: string };

export const Autocomplete = memo(BaseAutocomplete) as AutocompleteType;

Autocomplete.displayName = 'Autocomplete';
