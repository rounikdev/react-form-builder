import { FC, Fragment, memo } from 'react';

import { useTranslation } from '../../hooks';
import { TranslationProps } from '../../types';

export const Translation: FC<TranslationProps> = memo(({ substitutes, text }) => {
  const { translate } = useTranslation();

  let view = translate(text, substitutes);

  if (Array.isArray(view)) {
    view = view.map((el, index) => {
      return <Fragment key={index}>{el}</Fragment>;
    });
  }

  return <>{view}</>;
});

Translation.displayName = 'Translation';
