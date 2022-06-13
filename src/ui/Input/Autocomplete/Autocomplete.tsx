import { LegacyRef, memo, RefObject, useMemo } from 'react';

import { useClass } from '@rounik/react-custom-hooks';

import { useAutocomplete } from '@components';

import { ErrorField } from '../../ErrorField/ErrorField';
import { LabelField } from '../../LabelField/LabelField';

import { AutocompleteProps } from './types';
import { List } from './components';

import styles from './Autocomplete.scss';

const BaseAutocomplete = <T,>({
  autocomplete,
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
  multi,
  name,
  onBlur,
  onFocus,
  renderOption,
  required,
  requiredLabel,
  rowsToDisplay = 4,
  sideEffect,
  validator
}: AutocompleteProps<T>) => {
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
          <ul className={styles.MultiOptionList} data-test={`${dataTest}-chips-list`}>
            {selected
              .map((optionId) => {
                return list.find((item) => extractId(item) === optionId);
              })
              .map((option) => {
                return option ? (
                  <li
                    className={styles.MultiOption}
                    data-test={`${dataTest}-chip-list-item-${extractId(option)}`}
                    key={extractId(option)}
                  >
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
        <LabelField id={id} label={label} required={required} requiredLabel={requiredLabel} />
        <input
          autoComplete="off"
          {...(focusedId ? { 'aria-activedescendant': `${focusedId}-option` } : {})}
          {...(show ? { 'aria-controls': `${id}-listbox` } : {})}
          className={useClass([styles.Input, isError && styles.Error], [isError])}
          data-test={`${dataTest}-input`}
          disabled={disabled}
          id={id}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          onFocus={open}
          type="text"
          value={show && autocomplete ? search : selected.join(', ')}
          readOnly={!autocomplete}
          ref={fieldRef as LegacyRef<HTMLInputElement>}
        />
        <List
          dataTest={dataTest}
          id={id}
          list={show ? filteredList : []}
          multi={multi}
          renderOption={renderOption}
          rowsToDisplay={rowsToDisplay}
        />
        <ErrorField errors={errors} isError={isError} />
      </div>
    </Provider>
  );
};

type AutocompleteType = typeof BaseAutocomplete & { displayName: string };

export const Autocomplete = memo(BaseAutocomplete) as AutocompleteType;

Autocomplete.displayName = 'Autocomplete';
