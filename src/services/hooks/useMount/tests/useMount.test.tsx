import { FC } from 'react';

import { testRender } from '@services/utils';

import { useMount } from '../useMount';

describe('useMount', () => {
  it('Runs once on mount', () => {
    const TestComponent: FC<{ callback: () => void }> = ({ callback }) => {
      useMount(callback);

      return null;
    };

    const callback = jest.fn();

    const { rerender } = testRender(<TestComponent callback={callback} />);
    expect(callback).toHaveBeenCalledTimes(1);

    const updatedCallback = jest.fn();

    rerender(<TestComponent callback={updatedCallback} />);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).toHaveBeenCalledTimes(0);
  });
});
