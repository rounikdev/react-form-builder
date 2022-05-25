import { FC, memo, useCallback, useMemo, useState } from 'react';

import { accordionContext } from './context';
import { AccordionContext, AccordionGroupProps } from './types';

const { Provider } = accordionContext;

export const AccordionGroup: FC<AccordionGroupProps> = memo(({ children, maxOpened }) => {
  const [openedControlledAccordions, setOpenedControlledAccordions] = useState<string[]>([]);

  const closeInGroup = useCallback((id: string) => {
    setOpenedControlledAccordions((currentOpenedAccordions) =>
      currentOpenedAccordions.filter((openedAccordionId) => openedAccordionId !== id)
    );
  }, []);

  const openInGroup = useCallback(
    (id: string) => {
      setOpenedControlledAccordions((currentOpenedAccordions) => [
        ...currentOpenedAccordions.slice(maxOpened),
        id
      ]);
    },
    [maxOpened]
  );

  const contextState = useMemo<AccordionContext>(() => {
    return {
      closeInGroup,
      openedControlledAccordions,
      openInGroup
    };
  }, [closeInGroup, openedControlledAccordions, openInGroup]);

  return <Provider value={contextState}>{children}</Provider>;
});

AccordionGroup.displayName = 'AccordionGroup';
