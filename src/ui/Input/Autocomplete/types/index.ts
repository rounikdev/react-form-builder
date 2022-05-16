import { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';

import { Stylable, Testable } from '@root/types';
import { Field, TranslationSubstitute } from '@components';

export interface AutocompleteContext {
  close: () => void;
  focused: string;
  inputRef: RefObject<HTMLInputElement>;
  open: () => void;
  opened: boolean;
  select: Dispatch<SetStateAction<string>>;
  selected: string;
}

export interface AutocompleteProps<T> extends Field<T> {
  children: ({ options }: { options: T[] }) => ReactNode | ReactNode[];
  extractId: (item: T) => string;
  extractLabel: (item: T) => string;
  list: T[];
}

export interface OptionProps extends Stylable, Testable {
  id: string;
  substitutes?: TranslationSubstitute[];
  text: string;
}
