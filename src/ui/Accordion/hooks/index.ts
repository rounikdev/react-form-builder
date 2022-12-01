import { ReactNode, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';

import { useMount, useUnmount, useUpdate, useUpdateOnly } from '@rounik/react-custom-hooks';

import { accordionContext } from '../context';
import { AccordionContext, UseAccordionArgs } from '../types';

export const useAccordionGroup = () => useContext<AccordionContext>(accordionContext);

export const useAccordion = ({
  children,
  disabled,
  excludeFromGroup,
  id,
  keepMounted,
  onChange,
  opened
}: UseAccordionArgs) => {
  const { closeInGroup, openedControlledAccordions, openInGroup } = useAccordionGroup();

  const [content, setContent] = useState<ReactNode>(keepMounted ? children : null);

  const [height, setHeight] = useState<string | number>(0);

  const [isOpen, setIsOpen] = useState(opened);

  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const hiddenContent = useRef<HTMLDivElement>(null);

  const isOpenImperativeRef = useRef(false);

  const close = useCallback(() => {
    if (disabled) {
      return;
    }

    isOpenImperativeRef.current = false;

    setHeight(contentWrapperRef.current?.offsetHeight || 0);

    if (!excludeFromGroup) {
      closeInGroup(id);
    }

    requestAnimationFrame(() => {
      setIsOpen(false);
    });
  }, [closeInGroup, disabled, excludeFromGroup, id]);

  const open = useCallback(
    (omitImperativeIsOpen?: boolean) => {
      if (disabled) {
        return;
      }

      if (!omitImperativeIsOpen) {
        isOpenImperativeRef.current = true;
      }

      setHeight(0);

      if (!excludeFromGroup) {
        openInGroup(id);
      }

      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    },
    [excludeFromGroup, disabled, id, openInGroup]
  );

  const onTransitionEndHandler = useCallback(() => {
    if (!isOpen && !keepMounted) {
      setContent(null);
    }

    if (isOpen) {
      // This prevents some content to be cut-off:
      setHeight('auto');
    }
  }, [isOpen, keepMounted]);

  useMount(() => {
    if (isOpen) {
      openInGroup(id);
    }
  });

  useUnmount(() => {
    closeInGroup(id);
  });

  useUpdate(() => {
    if (isOpen) {
      setContent(children);
    } else {
      setHeight(0);
    }
  }, [children, isOpen]);

  useUpdateOnly(() => {
    if (!excludeFromGroup) {
      if (!openedControlledAccordions.includes(id) && isOpen) {
        close();
      }
    }
  }, [excludeFromGroup, openedControlledAccordions]);

  useUpdateOnly(() => {
    if (opened === isOpen) {
      return;
    }

    if (opened) {
      open(true);
    } else {
      close();
    }
  }, [opened]);

  useLayoutEffect(() => {
    if (isOpen && height === 0 && hiddenContent.current) {
      setHeight(hiddenContent.current.offsetHeight || 'auto');
    }
  }, [isOpen, height]);

  // Use to synchronize with the outer
  // controlling state if such exists:
  useUpdate(() => {
    if (onChange) {
      onChange({ id, opened: !!isOpen });
    }
  }, [isOpen]);

  return {
    close,
    content,
    contentWrapperRef,
    height,
    hiddenContent,
    isOpen,
    isOpenImperativeRef,
    onTransitionEndHandler,
    open
  };
};
