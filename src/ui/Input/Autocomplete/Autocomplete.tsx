import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

import { useClass, useKeyboardEvent, useOnOutsideClick } from '@rounik/react-custom-hooks';

import { AutocompleteContext, AutocompleteProps } from './types';

import styles from './Autocomplete.scss';

const initialContext: AutocompleteContext = {
  close: () => {
    // default function
  },
  focused: '',
  open: () => {
    // default function
  },
  inputRef: { current: null },
  opened: false,
  select: () => {
    // default function
  },
  selected: []
};

const Context = createContext(initialContext);

const BaseAutocomplete = <T,>({
  children,
  className,
  dataTest,
  extractId,
  extractLabel,
  id,
  label,
  list,
  multi
}: PropsWithChildren<AutocompleteProps<T>>) => {
  const [show, setShow] = useState(false);

  const [search, setSearch] = useState<string>('');

  const [focused, setFocused] = useState<string>('');

  const [selected, setSelected] = useState<string[]>([]);

  const focusRef = useRef(-1);

  const element = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredList = useMemo(() => {
    return list.filter((listItem) => {
      return extractLabel(listItem).toLocaleLowerCase().indexOf(search) >= 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, search]);

  const listboxContainerClasses = useClass(
    [styles.ListBoxContainer, !show && styles.Closed],
    [show]
  );

  const open = useCallback(() => {
    setShow(true);
    setSearch('');
  }, []);

  const close = useCallback(() => {
    setShow(false);
    focusRef.current = -1;
    setFocused('');

    if (selected.length) {
      setSearch(selected.join(', '));
    }
  }, [selected]);

  const keyUpHandler = useCallback(
    (event) => {
      if (!show) {
        return;
      }

      switch (event.code) {
        case 'ArrowDown':
          focusRef.current++;
          if (focusRef.current > filteredList.length - 1) {
            focusRef.current = 0;
          }
          break;

        case 'ArrowUp':
          focusRef.current--;
          if (focusRef.current < 0) {
            focusRef.current = filteredList.length - 1;
          }
          break;

        case 'End':
          focusRef.current = filteredList.length - 1;
          break;

        case 'Home':
          focusRef.current = 0;
          break;

        case 'Escape':
          setSelected([]);
          close();
          break;
      }

      setFocused(extractId(filteredList[focusRef.current]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredList, show]
  );

  const select = useCallback(
    (id: string) => {
      setSelected((currentSelected) => {
        if (!multi) {
          return [id];
        } else {
          if (currentSelected.includes(id)) {
            return currentSelected.filter((item) => item !== id);
          } else {
            return [...currentSelected, id];
          }
        }
      });
    },
    [multi]
  );

  useOnOutsideClick({ callback: close, element });

  useKeyboardEvent({
    eventType: 'keyup',
    handler: keyUpHandler
  });

  const contextValue = useMemo(() => {
    return {
      close,
      focused,
      open,
      inputRef,
      opened: show,
      select,
      selected
    };
  }, [close, focused, open, select, selected, show]);

  return (
    <Context.Provider value={contextValue}>
      <div
        aria-expanded={show}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        className={useClass([styles.Container, className], [className])}
        data-test={`${dataTest}-container`}
        ref={element}
        role="combobox"
        onBlur={(event) => {
          if (event.relatedTarget === null || !element.current?.contains(event.relatedTarget)) {
            close();
          }
        }}
      >
        <label id={`${id}-label`} htmlFor={`${id}-textbox`}>
          {label}
        </label>
        <input
          autoComplete="off"
          {...(focused ? { 'aria-activedescendant': `${focused}-option` } : {})}
          {...(show ? { 'aria-controls': `${id}-listbox` } : {})}
          className={styles.Input}
          id={`${id}-textbox`}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          onFocus={open}
          type="text"
          value={show ? search : selected}
          ref={inputRef}
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
              {typeof children === 'function' ? children({ options: filteredList }) : children}
            </ul>
          </div>
        ) : null}
      </div>
    </Context.Provider>
  );
};

export const useCombobox = () => {
  return useContext(Context);
};

type AutocompleteType = typeof BaseAutocomplete & { displayName: string };

export const Autocomplete = memo(BaseAutocomplete) as AutocompleteType;

Autocomplete.displayName = 'Autocomplete';
