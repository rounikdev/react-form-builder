import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

import { useKeyboardEvent, useOnOutsideClick, useUpdateOnly } from '@rounik/react-custom-hooks';

import { useField } from '@components/Form';

import { AutocompleteContext, UseAutocompleteArgs, UseAutocompleteReturnType } from './types';

const initialContext: AutocompleteContext = {
  close: () => {
    // default function
  },
  focused: '',
  multi: false,
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

export const useAutocomplete = <T>({
  dependencyExtractor,
  extractId,
  extractLabel,
  formatter,
  initialValue = [],
  list,
  multi,
  name,
  onBlur,
  onFocus,
  sideEffect,
  validator
}: UseAutocompleteArgs<T>): UseAutocompleteReturnType<T> => {
  const {
    errors,
    fieldRef,
    focused: isFocused,
    isEdit,
    onBlurHandler,
    onChangeHandler,
    onFocusHandler,
    touched,
    valid,
    validating,
    value
  } = useField<T[]>({
    dependencyExtractor,
    formatter,
    initialValue: multi ? initialValue : initialValue.length ? [initialValue[0]] : [],
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });

  const [show, setShow] = useState(false);

  const [search, setSearch] = useState<string>('');

  const [focused, setFocused] = useState<string>('');

  const [selected, setSelected] = useState<string[]>(value.map((option) => extractId(option)));

  const focusRef = useRef(-1);

  const element = useRef<HTMLDivElement>(null);

  const filteredList = useMemo(() => {
    return list.filter((listItem) => {
      return extractLabel(listItem).toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, search]);

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

    // This is needed to have
    // correct focused state:
    (onBlurHandler as UseAutocompleteReturnType<T>['onBlurHandler'])();
  }, [onBlurHandler, selected]);

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

      if (filteredList[focusRef.current]) {
        setFocused(extractId(filteredList[focusRef.current]));
      }
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

  useOnOutsideClick({
    callback: () => {
      if (show) {
        close();
      }
    },
    element
  });

  useKeyboardEvent({
    eventType: 'keyup',
    handler: keyUpHandler
  });

  const contextValue: AutocompleteContext = useMemo(() => {
    return {
      close,
      focused,
      multi,
      open,
      inputRef: fieldRef as RefObject<HTMLInputElement>,
      opened: show,
      select,
      selected
    };
  }, [close, fieldRef, focused, multi, open, select, selected, show]);

  useUpdateOnly(() => {
    onChangeHandler(
      list.filter((option) => {
        return selected.includes(extractId(option));
      })
    );
  }, [selected]);

  // Update from value from useField:
  useUpdateOnly(() => {
    setSelected((currentSelected) => {
      if (value.length !== currentSelected.length) {
        return value.map((option) => extractId(option));
      } else {
        const dif = value.filter((item) => !currentSelected.includes(extractId(item)));

        if (dif.length) {
          return value.map((option) => extractId(option));
        } else {
          return currentSelected;
        }
      }
    });
  }, [value]);

  return {
    close,
    context: contextValue,
    errors,
    fieldRef,
    filteredList,
    focused: isFocused,
    focusedId: focused,
    isEdit,
    onBlurHandler: onBlurHandler as UseAutocompleteReturnType<T>['onBlurHandler'],
    onFocusHandler,
    open,
    Provider: Context.Provider,
    search,
    select,
    selected,
    setSearch,
    show,
    touched,
    valid,
    validating,
    wrapperRef: element
  };
};

export const useComboBox = () => {
  return useContext(Context);
};
