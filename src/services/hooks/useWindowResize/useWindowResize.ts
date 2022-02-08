import { useRef } from 'react';

import { GlobalModel } from '@services/models';

import { useMount } from '../useMount/useMount';
import { useUnmount } from '../useUnmount/useUnmount';

const WINDOW_ON_RESIZE_DEBOUNCE_TIME = 200;

export const useWindowResize = ({ callback }: { callback: ResizeObserverCallback }) => {
  const onWindowResizeRef = useRef<((this: Window, ev: UIEvent) => void) | null>(null);

  useMount(() => {
    onWindowResizeRef.current = GlobalModel.debounceRAF(callback, WINDOW_ON_RESIZE_DEBOUNCE_TIME);

    window.addEventListener('resize', onWindowResizeRef.current);
  });

  useUnmount(() => {
    if (onWindowResizeRef.current) {
      window.removeEventListener('resize', onWindowResizeRef.current);
    }
  });
};
