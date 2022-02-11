import { FC } from 'react';

import { testRender } from '@services/utils';

import { useKeyboardEvent } from '../useKeyboardEvent';

describe('useKeyboardEvent', () => {
  const originalDocumentAddEventListener = document.addEventListener;
  let map: { [key: string]: EventListenerOrEventListenerObject } = {};

  beforeEach(() => {
    map = {};
    document.addEventListener = jest.fn((e, cb) => {
      map[e] = cb;
    });
  });

  afterAll(() => {
    document.addEventListener = originalDocumentAddEventListener;
  });

  it('Calls a handler on keyup', () => {
    const CODE = 'ArrowUp';
    const mockFn = jest.fn();

    const mockHandler = jest.fn(({ code }: KeyboardEvent) => {
      switch (code) {
        case CODE:
          mockFn();
          break;
      }
    });

    const TestComponent: FC<{ handler: () => void }> = ({ handler }) => {
      useKeyboardEvent({ eventType: 'keyup', handler });

      return <div />;
    };

    testRender(<TestComponent handler={mockHandler as unknown as () => void} />);

    (map.keyup as EventListener)({ code: 'ArrowUp' } as unknown as Event);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
