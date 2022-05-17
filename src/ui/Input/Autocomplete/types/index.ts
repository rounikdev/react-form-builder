import { ReactNode } from 'react';

import { Stylable, Testable } from '@root/types';
import { Field, TranslationSubstitute } from '@components';

export interface AutocompleteProps<T> extends Omit<Field<T[]>, 'onBlur'> {
  children: ({ options }: { options: T[] }) => ReactNode | ReactNode[];
  extractId: (item: T) => string;
  extractLabel: (item: T) => string;
  initialValue?: T[];
  list: T[];
  multi?: boolean;
  onBlur?: () => void; // because we are calling onBlurHandler without providing an event
}

export interface OptionProps extends Stylable, Testable {
  id: string;
  substitutes?: TranslationSubstitute[];
  text: string;
}
