import { ReactNode } from 'react';

import { Field, TranslationSubstitute } from '../../../../components';
import { Stylable, Testable } from '../../../../types';

export interface AutocompleteProps<T> extends Omit<Field<T[]>, 'onBlur'> {
  autocomplete?: boolean;
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
