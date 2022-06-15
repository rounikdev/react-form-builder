import { ReactNode, RefObject } from 'react';

import { Field, TranslationSubstitute } from '@core';
import { Stylable, Testable } from '@types';

export interface ListProps<T> extends Testable {
  id: string;
  list: T[];
  multi?: boolean;
  renderOption: ({}: { item: T; ref: RefObject<HTMLLIElement> }) => ReactNode;
  rowsToDisplay?: number;
}

export interface AutocompleteProps<T> extends Omit<Field<T[]>, 'onBlur'>, ListProps<T> {
  autocomplete?: boolean;
  extractId: (item: T) => string;
  extractLabel: (item: T) => string;
  initialValue?: T[];
  onBlur?: () => void; // because we are calling onBlurHandler without providing an event
}

export interface OptionProps extends Stylable, Testable {
  id: string;
  substitutes?: TranslationSubstitute[];
  text: string;
}
