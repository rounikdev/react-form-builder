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

interface GetInitialValueArgs<T> {
  extractId: (item: T) => string;
  multi?: boolean;
  options: T[];
  value: T[];
}
const getInitialValue = <T>({ extractId, multi, options, value }: GetInitialValueArgs<T>): T[] => {
  const hasNonExistingOption = value.find(
    (incomingOption) => !options.find((option) => extractId(option) === extractId(incomingOption))
  );

  let initialValue = value;

  if (hasNonExistingOption) {
    initialValue = value.filter(
      (incomingOption) =>
        !!options.find((option) => extractId(option) === extractId(incomingOption))
    );
  }

  return multi ? initialValue : initialValue.length ? [initialValue[0]] : [];
};

// TODO: Filter the value for non existing options on options change

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
    initialValue: getInitialValue({ extractId, multi, options: list, value: initialValue }),
    name,
    onBlur,
    onFocus,
    sideEffect,
    validator
  });

  const [state, setState] = useState({
    focused: '',
    search: '',
    selected: value.map((option) => extractId(option)),
    show: false
  });

  const focusRef = useRef(-1);

  const element = useRef<HTMLDivElement>(null);

  const filteredList = useMemo(() => {
    return list.filter((listItem) => {
      return extractLabel(listItem).toLowerCase().indexOf(state.search.toLowerCase()) >= 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, state.search]);

  const open = useCallback(() => {
    setState((currentState) => ({ ...currentState, search: '', show: true }));
  }, []);

  const close = useCallback(() => {
    focusRef.current = -1;

    setState((currentState) => ({
      ...currentState,
      focused: '',
      search: state.selected.join(', '),
      show: false
    }));

    // This is needed to have
    // correct focused state:
    (onBlurHandler as UseAutocompleteReturnType<T>['onBlurHandler'])();
  }, [onBlurHandler, state.selected]);

  const keyUpHandler = useCallback(
    (event) => {
      if (!state.show) {
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
          setState((currentState) => ({
            ...currentState,
            focused: '',
            search: '',
            selected: [],
            show: false
          }));

          return;
      }

      if (filteredList[focusRef.current]) {
        setState((currentState) => ({
          ...currentState,
          focused: extractId(filteredList[focusRef.current])
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredList, state.show]
  );

  const select = useCallback(
    (id: string) => {
      setState((currentState) => {
        let newSelected = currentState.selected;

        if (!multi) {
          newSelected = [id];
        } else {
          if (newSelected.includes(id)) {
            newSelected = newSelected.filter((item) => item !== id);
          } else {
            newSelected = [...newSelected, id];
          }
        }

        return {
          ...currentState,
          selected: newSelected
        };
      });
    },
    [multi]
  );

  const setSearch = useCallback((search: string) => {
    setState((currentState) => ({ ...currentState, search }));
  }, []);

  useOnOutsideClick({
    callback: () => {
      if (state.show) {
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
      focused: state.focused,
      multi,
      open,
      inputRef: fieldRef as RefObject<HTMLInputElement>,
      opened: state.show,
      select,
      selected: state.selected
    };
  }, [close, fieldRef, multi, open, select, state.focused, state.selected, state.show]);

  useUpdateOnly(() => {
    onChangeHandler(
      list.filter((option) => {
        return state.selected.includes(extractId(option));
      })
    );
  }, [state.selected]);

  // Update from value from useField:
  useUpdateOnly(() => {
    if (
      value.find(
        (incomingOption) => !list.find((option) => extractId(option) === extractId(incomingOption))
      )
    ) {
      // if there is an incoming option that
      // doesn't exist in the options list:
      return;
    }

    setState((currentState) => {
      let newSelected = currentState.selected;

      if (!multi) {
        if (newSelected[0] !== extractId(value[0])) {
          newSelected = [extractId(value[0])];
        } else {
          newSelected = newSelected;
        }
      } else {
        if (value.length !== newSelected.length) {
          newSelected = value.map((option) => extractId(option));
        } else {
          const dif = value.filter((item) => !newSelected.includes(extractId(item)));

          if (dif.length) {
            newSelected = value.map((option) => extractId(option));
          } else {
            newSelected = newSelected;
          }
        }
      }

      return {
        ...currentState,
        selected: newSelected
      };
    });
  }, [value]);

  return {
    close,
    context: contextValue,
    errors,
    fieldRef,
    filteredList,
    focused: isFocused,
    focusedId: state.focused,
    isEdit,
    onBlurHandler: onBlurHandler as UseAutocompleteReturnType<T>['onBlurHandler'],
    onFocusHandler,
    open,
    Provider: Context.Provider,
    search: state.search,
    select,
    selected: state.selected,
    setSearch,
    show: state.show,
    touched,
    valid,
    validating,
    wrapperRef: element
  };
};

export const useComboBox = () => {
  return useContext(Context);
};
