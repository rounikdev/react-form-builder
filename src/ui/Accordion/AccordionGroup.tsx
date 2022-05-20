import { FC, memo, useCallback, useMemo, useState } from 'react';

import { useUpdate } from '@rounik/react-custom-hooks';

import { accordionContext } from './context';
import { AccordionContext, AccordionControls, AccordionGroupProps, OpenedAccordion } from './types';

const { Provider } = accordionContext;

export const AccordionGroup: FC<AccordionGroupProps> = memo(({ children, maxOpened = 0 }) => {
  const [state, setState] = useState<AccordionControls>({});

  const [openedAccordions, setOpenedAccordions] = useState<OpenedAccordion[]>([]);

  // Used on accordion's mount:
  const addAccordion = useCallback(({ close, id, open }) => {
    setState((currentState) => {
      return {
        ...currentState,
        [id]: {
          close,
          open
        }
      };
    });
  }, []);

  // Remove accordion from 'opened accordions list'.
  // Used on on accordion's closing:
  const closeInAccordionGroup = useCallback((id: string) => {
    setOpenedAccordions((currentOpenedAccordions) =>
      currentOpenedAccordions.filter((item) => item.id !== id)
    );
  }, []);

  // Add accordion to the 'opened accordions list'.
  // Used on on accordion's opening:
  const openInAccordionGroup = useCallback(({ id, keepOpened }: OpenedAccordion) => {
    setOpenedAccordions((currentOpenedAccordions) => [
      ...currentOpenedAccordions,
      { id, keepOpened }
    ]);
  }, []);

  // Used on accordion's unmount:
  const removeAccordion = useCallback(
    (id) => {
      setState((currentState) => {
        const newState = { ...currentState };
        delete newState[id];

        return newState;
      });

      closeInAccordionGroup(id);
    },
    [closeInAccordionGroup]
  );

  const contextState = useMemo<AccordionContext>(() => {
    return {
      addAccordion,
      closeInAccordionGroup,
      openInAccordionGroup,
      removeAccordion
    };
  }, [addAccordion, closeInAccordionGroup, openInAccordionGroup, removeAccordion]);

  // Controls the number of opened accordions:
  useUpdate(() => {
    if (maxOpened) {
      if (openedAccordions.length > maxOpened) {
        const maxAccordionsToClose = openedAccordions.length - maxOpened;

        const numberOfAccordionsThatCanBeClosed = openedAccordions.reduce((num, item) => {
          if (!item.keepOpened) {
            num += 1;
          }

          return num;
        }, 0);

        if (numberOfAccordionsThatCanBeClosed === 0) {
          return;
        }

        let numberOfAccordionsToClose = Math.min(
          maxAccordionsToClose,
          numberOfAccordionsThatCanBeClosed
        );

        for (let i = 0; i < openedAccordions.length; i++) {
          if (!openedAccordions[i].keepOpened) {
            state[openedAccordions[i].id].close();
            numberOfAccordionsToClose--;
          }

          if (numberOfAccordionsToClose === 0) {
            break;
          }
        }
      }
    }
  }, [maxOpened, openedAccordions]);

  return <Provider value={contextState}>{children}</Provider>;
});

AccordionGroup.displayName = 'AccordionGroup';
