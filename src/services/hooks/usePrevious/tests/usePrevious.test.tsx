import { FC } from 'react';

import { ShowHide, testRender } from '@services/utils';

import { usePrevious } from '../usePrevious';

describe('usePrevious', () => {
  it('Provides the previous value', () => {
    const TestComponent: FC<{ value: string }> = ({ value }) => {
      const previousValue = usePrevious(value);

      return (
        <>
          <div data-test="previous">{previousValue}</div>
          <div data-test="current">{value}</div>
        </>
      );
    };

    const valueA = 'valueA';
    const valueB = 'valueB';

    const { getByDataTest, rerender } = testRender(
      <ShowHide data={valueA} show={true}>
        {(show, data) => {
          return show ? <TestComponent value={data} /> : null;
        }}
      </ShowHide>
    );

    expect(getByDataTest('previous')).toHaveTextContent(valueA);
    expect(getByDataTest('current')).toHaveTextContent(valueA);

    rerender(
      <ShowHide data={valueB} show={true}>
        {(show, data) => {
          return show ? <TestComponent value={data} /> : null;
        }}
      </ShowHide>
    );
    expect(getByDataTest('previous')).toHaveTextContent(valueA);
    expect(getByDataTest('current')).toHaveTextContent(valueB);
  });
});
