import { FC } from 'react';

import { testRender } from '@services/utils';

import { useUpdateOnly } from '../useUpdateOnly';

describe('useUpdateOnly', () => {
  it("Doesn't run on mount", () => {
    const TestComponent: FC<{ callback: () => void; otherProp: string }> = ({
      callback,
      otherProp
    }) => {
      useUpdateOnly(callback, [callback]);

      return <div>{otherProp}</div>;
    };

    const callback = jest.fn();

    testRender(<TestComponent callback={callback} otherProp="valueA" />);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('Runs the callback when dependency changes', () => {
    const TestComponent: FC<{ callback: () => void; otherProp: string }> = ({
      callback,
      otherProp
    }) => {
      useUpdateOnly(callback, [callback]);

      return <div>{otherProp}</div>;
    };

    const callback = jest.fn();

    const { rerender } = testRender(<TestComponent callback={callback} otherProp="valueA" />);

    const updatedCallback = jest.fn();

    rerender(<TestComponent callback={updatedCallback} otherProp="valueA" />);

    expect(callback).toHaveBeenCalledTimes(0);
    expect(updatedCallback).toHaveBeenCalledTimes(1);
  });

  it("Doesn't run the callback if other prop changes", () => {
    const TestComponent: FC<{ callback: () => void; otherProp: string }> = ({
      callback,
      otherProp
    }) => {
      useUpdateOnly(callback, [callback]);

      return <div>{otherProp}</div>;
    };

    const callback = jest.fn();

    const { rerender } = testRender(<TestComponent callback={callback} otherProp="valueA" />);

    rerender(<TestComponent callback={callback} otherProp="valueB" />);

    expect(callback).toHaveBeenCalledTimes(0);
  });
});
