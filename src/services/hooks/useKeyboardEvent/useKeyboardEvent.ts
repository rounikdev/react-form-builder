import { useEffect } from 'react';
import { UseKeyboardEventConfig } from '../types';

export const useKeyboardEvent = ({ eventType, handler }: UseKeyboardEventConfig): void => {
  useEffect(() => {
    document.addEventListener(eventType, handler);

    return () => document.removeEventListener(eventType, handler);
  });
};
