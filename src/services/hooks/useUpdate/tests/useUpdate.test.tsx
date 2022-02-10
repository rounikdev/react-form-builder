import { FC } from 'react';

import { testRender } from '@services/utils';

import { useUpdate } from '../useUpdate';

describe('useUpdate', () => {
  it('Runs on mount and when dependency changes', () => {
    const TestComponent: FC<{ callback: () => void; otherProp: string }> = ({
      callback,
      otherProp
    }) => {
      useUpdate(callback, [callback]);

      return <div>{otherProp}</div>;
    };

    const callback = jest.fn();

    const { rerender } = testRender(<TestComponent callback={callback} otherProp="valueA" />);

    expect(callback).toHaveBeenCalledTimes(1);

    const updatedCallback = jest.fn();

    rerender(<TestComponent callback={updatedCallback} otherProp="valueA" />);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).toHaveBeenCalledTimes(1);
  });

  it("Doesn't run when other prop changes", () => {
    const TestComponent: FC<{ callback: () => void; otherProp: string }> = ({
      callback,
      otherProp
    }) => {
      useUpdate(callback, [callback]);

      return <div>{otherProp}</div>;
    };

    const callback = jest.fn();

    const { rerender } = testRender(<TestComponent callback={callback} otherProp="valueA" />);

    expect(callback).toHaveBeenCalledTimes(1);

    rerender(<TestComponent callback={callback} otherProp="valueB" />);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
