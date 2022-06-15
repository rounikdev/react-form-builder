import { Provider, RefObject } from 'react';

import { UseFieldConfig, UseFieldReturnType } from '@core/Form/types';

export interface AutocompleteContext {
  close: () => void;
  focused: string;
  inputRef: RefObject<HTMLInputElement>;
  multi?: boolean;
  open: () => void;
  opened: boolean;
  select: (id: string) => void;
  selected: string[];
}

export interface UseAutocompleteArgs<T>
  extends Omit<UseFieldConfig<T[]>, 'initialValue' | 'onBlur'> {
  extractId: (item: T) => string;
  extractLabel: (item: T) => string;
  initialValue?: T[];
  list: T[];
  multi?: boolean;
  onBlur?: () => void;
}

export interface UseAutocompleteReturnType<T>
  extends Omit<UseFieldReturnType<T>, 'onChangeHandler' | 'value' | 'onBlurHandler'> {
  close: AutocompleteContext['close'];
  context: AutocompleteContext;
  filteredList: T[];
  focusedId: string;
  onBlurHandler: () => void;
  open: AutocompleteContext['open'];
  Provider: Provider<AutocompleteContext>;
  search: string;
  select: AutocompleteContext['select'];
  selected: string[];
  setSearch: (search: string) => void;
  show: boolean;
  wrapperRef: RefObject<HTMLElement>;
}
