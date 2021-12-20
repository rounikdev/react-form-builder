import { useCallback, useEffect } from 'react';

import { UseOnOutsideClickConfig } from '../types';

export const useOnOutsideClick = ({ callback, element }: UseOnOutsideClickConfig): void => {
  const onDocumentClickHandler = useCallback(
    (event: MouseEvent) => {
      if (element.current) {
        if (!element.current.contains(event.target as Node)) {
          callback();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, element.current]
  );

  useEffect(() => {
    document.addEventListener('click', onDocumentClickHandler);

    return () => document.removeEventListener('click', onDocumentClickHandler);
  }, [onDocumentClickHandler]);
};
