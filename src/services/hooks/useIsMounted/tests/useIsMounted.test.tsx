import { FC, useEffect } from 'react';

import { ShowHide, testRender } from '@services/utils';

import { useIsMounted } from '../useIsMounted';

describe('useIsMounted', () => {
  it('Provides the correct mounted state', () => {
    const mockCallback = jest.fn();

    const TestComponent: FC<{ callback: () => void }> = ({ callback }) => {
      const isMounted = useIsMounted();

      useEffect(() => {
        if (isMounted.current) {
          callback();
        }

        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          if (isMounted.current) {
            callback();
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return null;
    };

    const { rerender } = testRender(
      <ShowHide show={true}>
        {(show) => {
          return show ? <TestComponent callback={mockCallback} /> : null;
        }}
      </ShowHide>
    );

    expect(mockCallback).toHaveBeenCalledTimes(1);

    rerender(
      <ShowHide show={false}>
        {(show) => {
          return show ? <TestComponent callback={mockCallback} /> : null;
        }}
      </ShowHide>
    );

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
