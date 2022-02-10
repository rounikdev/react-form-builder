import { FC, useRef } from 'react';

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

    const TestComponent: FC<{ show: boolean }> = ({ show }) => {
      const ref = useRef<HTMLDivElement>(null);

      useMutationObserver({
        callback: mockObserverCallback,
        config: MUTATION_OBSERVER_CONFIG,
        target: ref
      });

      return (
        <div data-test="parent" ref={ref}>
          {show ? <div data-test="child">Some new content</div> : null}
        </div>
      );
    };

    const { findByDataTest, rerender } = testRender(
      <ShowHide data={false} show={true}>
        {(show, showNestedContent) => {
          return show ? <TestComponent show={showNestedContent} /> : null;
        }}
      </ShowHide>
    );

    expect(mockObserverCallback).toHaveBeenCalledTimes(0);

    rerender(
      <ShowHide data={true} show={true}>
        {(show, showNestedContent) => {
          return show ? <TestComponent show={showNestedContent} /> : null;
        }}
      </ShowHide>
    );

    await findByDataTest('child');

    expect(mockObserverCallback).toHaveBeenCalledTimes(1);

    rerender(
      <ShowHide data={true} show={false}>
        {(show, showNestedContent) => {
          return show ? <TestComponent show={showNestedContent} /> : null;
        }}
      </ShowHide>
    );

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
