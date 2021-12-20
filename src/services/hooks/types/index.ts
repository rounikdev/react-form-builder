import { EffectCallback, RefObject } from 'react';

export type CleanupCallback = void | (() => void | undefined);

export type KeyboardEventType = 'keydown' | 'keyup';

export type MountCallback = EffectCallback | { (): Promise<void> };

export type UpdateCallback = EffectCallback | { (): Promise<void> };

export type UseKeyboardEventConfig = {
  eventType: KeyboardEventType;
  handler: (event: KeyboardEvent) => void;
};

export type UseMutationObserverConfig = {
  callback: MutationCallback;
  config: MutationObserverInit;
  target: RefObject<Node>;
};

export type UseOnOutsideClickConfig = {
  callback: () => void;
  element: RefObject<HTMLElement>;
};

export type UseResizeObserverConfig = {
  callback: ResizeObserverCallback;
  target: RefObject<HTMLElement>;
};
