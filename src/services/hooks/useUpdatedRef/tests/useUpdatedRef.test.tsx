import { FC } from 'react';

import { testRender } from '@services/utils';

import { useUpdatedRef } from '../useUpdatedRef';

describe('useUpdatedRef', () => {
  it('Returns updated ref value without re-rendering the host component', () => {
    const TestComponent: FC<{ otherProp: string; value: string }> = ({ otherProp, value }) => {
      const ref = useUpdatedRef(value);

      return (
        <>
          <div>{otherProp}</div>
          <div data-test="value">{ref.current}</div>
        </>
      );
    };

    const valueA = 'valueA';
    const valueB = 'valueB';

    const { getByDataTest, rerender } = testRender(
      <TestComponent otherProp="otherPropA" value={valueA} />
    );

    expect(getByDataTest('value')).toHaveTextContent(valueA);

    rerender(<TestComponent otherProp="otherPropA" value={valueB} />);

    expect(getByDataTest('value')).toHaveTextContent(valueA);

    rerender(<TestComponent otherProp="otherPropB" value={valueB} />);

    expect(getByDataTest('value')).toHaveTextContent(valueB);
  });
});
