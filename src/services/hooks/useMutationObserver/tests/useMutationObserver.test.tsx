import { FC, useRef, useState } from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ShowHide, testRender } from '@services/utils';

import { useMutationObserver } from '../useMutationObserver';

describe('useMutationObserver', () => {
  const MUTATION_OBSERVER_CONFIG = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  };

  it("Calls callback on target's update", async () => {
    const mockObserverCallback = jest.fn();

    const TestComponent: FC = () => {
      const ref = useRef<HTMLDivElement>(null);
      const [show, setShow] = useState(true);

      useMutationObserver({
        callback: mockObserverCallback,
        config: MUTATION_OBSERVER_CONFIG,
        target: ref
      });

      return (
        <div data-test="parent" ref={ref}>
          <button data-test="button" onClick={() => setShow((current) => !current)}></button>
          {show ? <div data-test="child">Some new content</div> : null}
        </div>
      );
    };

    const { getByDataTest } = testRender(<TestComponent />);

    expect(mockObserverCallback).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.click(getByDataTest('button'));
    });

    expect(mockObserverCallback).toHaveBeenCalledTimes(1);
  });

  it("Doesn't call callback if no target", async () => {
    const mockObserverCallback = jest.fn();

    const TestComponent: FC = () => {
      const ref = useRef<HTMLDivElement>(null);

      useMutationObserver({
        callback: mockObserverCallback,
        config: MUTATION_OBSERVER_CONFIG,
        target: ref
      });

      return null;
    };

    const { rerender } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return show ? <TestComponent /> : null;
        }}
      </ShowHide>
    );

    expect(mockObserverCallback).toHaveBeenCalledTimes(0);

    rerender(
      <ShowHide show={false}>
        {(show) => {
          return show ? <TestComponent /> : null;
        }}
      </ShowHide>
    );

    expect(mockObserverCallback).toHaveBeenCalledTimes(0);
  });
});
