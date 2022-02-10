import { FC, useRef } from 'react';

import { testRender } from '@services/utils';

import { useOnOutsideClick } from '../useOnOutsideClick';

describe('useOnOutsideClick', () => {
  it('Calls a callback only if click is outside of a specified target', () => {
    const map: { [key: string]: EventListenerOrEventListenerObject } = {};

    document.addEventListener = jest.fn((e, cb) => {
      map[e] = cb;
    });

    const mockCallback = jest.fn();

    const TestComponent: FC<{ callback: () => void }> = ({ callback }) => {
      const element = useRef(null);
      useOnOutsideClick({ callback, element });
      return (
        <div ref={element}>
          <button data-test="inside-element">Click</button>
        </div>
      );
    };

    const { getByDataTest } = testRender(
      <div>
        <button data-test="outside-element">Outside</button>
        <TestComponent callback={mockCallback} />
      </div>
    );

    (map.click as EventListener)({ target: getByDataTest('inside-element') } as unknown as Event);
    expect(mockCallback).toHaveBeenCalledTimes(0);

    (map.click as EventListener)({ target: getByDataTest('outside-element') } as unknown as Event);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("Doesn't calls a callback if no current element", () => {
    const map: { [key: string]: EventListenerOrEventListenerObject } = {};

    document.addEventListener = jest.fn((e, cb) => {
      map[e] = cb;
    });

    const mockCallback = jest.fn();

    const TestComponent: FC<{ callback: () => void }> = ({ callback }) => {
      const element = useRef(null);
      useOnOutsideClick({ callback, element });
      return (
        <div>
          <button data-test="inside-element">Click</button>
        </div>
      );
    };

    const { getByDataTest } = testRender(
      <div>
        <button data-test="outside-element">Outside</button>
        <TestComponent callback={mockCallback} />
      </div>
    );

    (map.click as EventListener)({ target: getByDataTest('inside-element') } as unknown as Event);
    expect(mockCallback).toHaveBeenCalledTimes(0);

    (map.click as EventListener)({ target: getByDataTest('outside-element') } as unknown as Event);
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});
