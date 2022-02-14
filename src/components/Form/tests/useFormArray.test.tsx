import { useMemo } from 'react';
import userEvent from '@testing-library/user-event';

import { testRender } from '@services/utils';

import { useFormArray } from '../useFormArray';

const testData = [
  {
    id: 'tomato-str',
    numbers: [
      { id: '1', value: '1' },
      { id: '2', value: '2' }
    ],
    street: 'Tomato'
  }
];

const addressFactory = () => {
  return {
    id: 'new-id',
    numbers: [],
    street: ''
  };
};

const numberFactory = () => {
  return {
    id: 'new-id',
    value: ''
  };
};

const StateReader = ({
  initialValue,
  method,
  path = []
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any[];
  method?: 'add' | 'remove';
  path?: (number | string)[];
}) => {
  const { add, onReset, remove, state } = useFormArray({
    initialValue,
    factories: {
      address: addressFactory,
      number: numberFactory
    }
  });

  const methods = useMemo(() => {
    return {
      add,
      onReset,
      remove
    };
  }, [add, onReset, remove]);

  return (
    <>
      <button data-test="button" onClick={() => method && methods[method](...path)}></button>
      <div data-test="state">{JSON.stringify(state)}</div>
      <button data-test="reset-button" onClick={onReset}></button>
    </>
  );
};

describe('useFormArray', () => {
  it('useFormArray provides the initial state', () => {
    const { getByDataTest } = testRender(
      <StateReader initialValue={JSON.parse(JSON.stringify(testData))} />
    );

    const state = JSON.parse(getByDataTest('state').textContent || '');
    expect(state).toEqual(testData);
  });

  it('useFormArray "add" method', () => {
    const { getByDataTest } = testRender(
      <StateReader
        initialValue={JSON.parse(JSON.stringify(testData))}
        method="add"
        path={[0, 'numbers', 'number']}
      />
    );

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA).toEqual(testData);

    userEvent.click(getByDataTest('button'));

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB).toEqual([
      {
        id: 'tomato-str',
        numbers: [
          { id: '1', value: '1' },
          { id: '2', value: '2' },
          { id: 'new-id', value: '' }
        ],
        street: 'Tomato'
      }
    ]);
  });

  it('useFormArray "onReset" sets the state to the initial one', () => {
    const { getByDataTest } = testRender(
      <StateReader
        initialValue={JSON.parse(JSON.stringify(testData))}
        method="remove"
        path={[0, 'numbers', 0]}
      />
    );

    const stateA = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateA).toEqual(testData);

    userEvent.click(getByDataTest('button'));

    const stateB = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateB).toEqual([
      {
        id: 'tomato-str',
        numbers: [{ id: '2', value: '2' }],
        street: 'Tomato'
      }
    ]);

    userEvent.click(getByDataTest('reset-button'));

    const stateC = JSON.parse(getByDataTest('state').textContent || '');
    expect(stateC).toEqual(testData);
  });
});
