import { FC, useCallback, useMemo, useRef } from 'react';

import { useKeyboardEvent } from '@rounik/react-custom-hooks';

import { tabTrapContext as Context } from './context';
import { FocusableHTMLElement, TabTrapContext, TabTrapProps } from './types';

export const TabTrap: FC<TabTrapProps> = ({ active, children }) => {
  const firstTabFocusableRef = useRef<FocusableHTMLElement>(null);

  const lastTabFocusableRef = useRef<FocusableHTMLElement>(null);

  const isFocused = useRef<boolean>(false);

  const context = useMemo<TabTrapContext>(
    () => ({
      firstTabFocusableRef,
      lastTabFocusableRef
    }),
    []
  );

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      const { code, shiftKey, target } = event;

      if (!active || code !== 'Tab') {
        return;
      }

      if (!isFocused.current || (document.activeElement as HTMLElement)?.tabIndex === -1) {
        event.preventDefault();

        if (shiftKey) {
          lastTabFocusableRef.current?.focus();
        } else {
          firstTabFocusableRef.current?.focus();
        }

        isFocused.current = true;

        return;
      }

      if (
        (target === firstTabFocusableRef.current && shiftKey) ||
        (target === lastTabFocusableRef.current && !shiftKey)
      ) {
        event.preventDefault();
      }

      if (shiftKey && target === firstTabFocusableRef.current) {
        lastTabFocusableRef.current?.focus();

        return;
      }

      if (target === lastTabFocusableRef.current && !shiftKey) {
        firstTabFocusableRef.current?.focus();

        return;
      }
    },
    [active]
  );

  useKeyboardEvent({
    eventType: 'keydown',
    handler: keyDownHandler
  });

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
