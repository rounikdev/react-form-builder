import userEvent from '@testing-library/user-event';
import { FC } from 'react';

import { useUpdateOnlyExtended } from '@rounik/react-custom-hooks';

import { testRender } from '@services/utils';

import { HeightTransitionProvider, useHeightTransition } from '../HeightTransitionProvider';

const TestComponent: FC<{ onForceUpdate: () => void }> = ({ onForceUpdate }) => {
  const {
    actions: { forceUpdate },
    shouldForceUpdate
  } = useHeightTransition();

  useUpdateOnlyExtended(() => {
    onForceUpdate();
  }, [onForceUpdate, shouldForceUpdate]);

  return (
    <button data-test="force-update-button" onClick={forceUpdate} type="button">
      Force Update
    </button>
  );
};

describe('HeightTransitionProvider', () => {
  it('Calls onForceUpdate when shouldForceUpdate changes', async () => {
    const mockForceUpdateCb = jest.fn();

    const { getByDataTest } = testRender(
      <HeightTransitionProvider>
        <TestComponent onForceUpdate={mockForceUpdateCb} />
      </HeightTransitionProvider>
    );

    await userEvent.click(getByDataTest('force-update-button'));

    expect(mockForceUpdateCb).toBeCalledTimes(1);
  });
});
