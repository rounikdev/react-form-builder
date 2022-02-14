import { FC, useRef } from 'react';
import userEvent from '@testing-library/user-event';

import { testRender } from '@services/utils';

import { useOnOutsideClick } from '../useOnOutsideClick';

describe('useOnOutsideClick', () => {
  it('Calls a callback only if click is outside of a specified target', () => {
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

    userEvent.click(getByDataTest('inside-element'));
    expect(mockCallback).toHaveBeenCalledTimes(0);

    userEvent.click(getByDataTest('outside-element'));
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("Doesn't calls a callback if no current element", () => {
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

    userEvent.click(getByDataTest('inside-element'));
    expect(mockCallback).toHaveBeenCalledTimes(0);

    userEvent.click(getByDataTest('outside-element'));
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});
