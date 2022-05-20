import { ReactNode, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';

import { useMount, useUnmount, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { accordionContext } from '../context';
import { AccordionContext, UseAccordionArgs } from '../types';

export const useAccordionGroup = () => useContext<AccordionContext>(accordionContext);

export const useAccordion = ({
  children,
  disabled = false,
  id,
  keepMounted = false,
  keepOpened = false,
  opened = false
}: UseAccordionArgs) => {
  const { addAccordion, closeInAccordionGroup, openInAccordionGroup, removeAccordion } =
    useAccordionGroup();

  const [contentElement, setContentElement] = useState<ReactNode>(keepMounted ? children : null);

  const [height, setHeight] = useState<string | number>(0);

  const [isOpen, setIsOpen] = useState(opened && !disabled);

  const content = useRef<HTMLDivElement>(null);

  const hiddenContent = useRef<HTMLDivElement>(null);

  const isTransitioning = useRef(false);

  const close = useCallback(() => {
    if (!isTransitioning.current) {
      setHeight(content.current?.offsetHeight || 0);

      closeInAccordionGroup(id);

      isTransitioning.current = true;

      requestAnimationFrame(() => {
        setIsOpen(false);
      });
    }
  }, [closeInAccordionGroup, id]);

  const open = useCallback(() => {
    if (!isTransitioning.current && !disabled) {
      setHeight(0);

      openInAccordionGroup({ id, keepOpened });

      isTransitioning.current = true;

      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }
  }, [disabled, id, keepOpened, openInAccordionGroup]);

  const onTransitionEndHandler = useCallback(() => {
    if (!isOpen && !keepMounted) {
      setContentElement(null);
    }

    if (isOpen) {
      setHeight('auto');
    }

    isTransitioning.current = false;
  }, [isOpen, keepMounted]);

  useMount(() => {
    addAccordion({ close, id, open });

    isOpen && openInAccordionGroup({ id, keepOpened });
  });

  useUnmount(() => {
    removeAccordion(id);

    closeInAccordionGroup(id);
  });

  useUpdate(() => {
    if (isOpen) {
      setContentElement(children);
    } else {
      setHeight(0);
    }
  }, [children, isOpen]);

  useUpdateOnly(() => {
    if (opened && !isOpen) {
      open();
    } else if (!opened && isOpen) {
      close();
    }
  }, [close, isOpen, open, opened]);

  useLayoutEffect(() => {
    const newHeight = height;

    if (isOpen && height === 0 && hiddenContent.current) {
      setHeight(hiddenContent.current.offsetHeight || newHeight);
    }
  }, [isOpen, height]);

  return {
    close,
    content,
    contentElement,
    height,
    hiddenContent,
    isOpen,
    onTransitionEndHandler,
    open
  };
};
