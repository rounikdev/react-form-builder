import { act, fireEvent, renderHook } from '@testing-library/react';
import { FC, MouseEvent } from 'react';

import { testRender } from '@services/utils';

import { useRange } from '../useRange';
import { useRangeContext } from '../useRangeContext';

const Track = () => {
  const context = useRangeContext();

  return (
    <div data-test="track" onClick={context.onTrackClickHandler} ref={context.trackRef}>
      {JSON.stringify({
        clientX: context.clientX,
        pixelsPerUnit: context.pixelsPerUnit,
        unitsPerPixel: context.unitsPerPixel,
        value: context.value
      })}
    </div>
  );
};

interface TestComponentProps {
  initialValue: {
    from: number;
    to: number;
  };
  max?: number;
  min?: number;
  name: string;
  options?: number[];
  single?: boolean;
  step?: number;
  stepExtra?: number;
}

const TestComponent: FC<TestComponentProps> = ({
  initialValue,
  max,
  min,
  name,
  options,
  single,
  step = 1,
  stepExtra = 1
}) => {
  const { context, Provider } = useRange({
    initialValue,
    max,
    min,
    name,
    options,
    single,
    step,
    stepExtra
  });

  return (
    <Provider value={context}>
      <Track />
    </Provider>
  );
};

describe('useRange', () => {
  it('Limits the initial value according to min and max when no options', () => {
    const initialValue = {
      from: 0,
      to: 10
    };

    const name = 'price';

    const { result } = renderHook(() =>
      useRange({ initialValue, max: 5, min: 1, name, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual({ from: 1, to: 5 });
  });

  it('Limits the initial value when from is bigger than to', () => {
    const initialValue = {
      from: 5,
      to: 4
    };

    const name = 'price';

    const { result } = renderHook(() =>
      useRange({ initialValue, max: 5, min: 1, name, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual({ from: 4, to: 4 });
  });

  it('Sets the initial value when there are min and max when no options', () => {
    const initialValue = {
      from: 2.5,
      to: 4
    };

    const name = 'price';

    const { result } = renderHook(() =>
      useRange({ initialValue, max: 5, min: 1, name, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual(initialValue);
  });

  it('Limits the initial value according to options', () => {
    const initialValue = {
      from: -10,
      to: 10
    };

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { result } = renderHook(() =>
      useRange({ initialValue, name, options, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual({ from: 1, to: 5 });
  });

  it('Sets the initial value when there are options', () => {
    const initialValue = {
      from: 2,
      to: 4
    };

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { result } = renderHook(() =>
      useRange({ initialValue, name, options, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual(initialValue);
  });

  it('Start move and stop move when no options', () => {
    const initialValue = {
      from: 2,
      to: 4
    };
    const name = 'price';

    const { result } = renderHook(() =>
      useRange({ initialValue, max: 10, min: 0, name, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual(initialValue);

    expect(result.current.context.isMoving).toEqual({ from: false, to: false });

    act(() => {
      result.current.context.setIsMoving({ from: true, to: false });
    });

    expect(result.current.context.isMoving).toEqual({ from: true, to: false });

    act(() => {
      result.current.context.stopMove();
    });

    expect(result.current.context.isMoving).toEqual({ from: false, to: false });

    expect(result.current.context.value).toEqual(initialValue);
  });

  it('Start move and stop move when options', () => {
    const initialValue = {
      from: 2,
      to: 4
    };

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { result } = renderHook(() =>
      useRange({ initialValue, name, options, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.value).toEqual(initialValue);

    expect(result.current.context.isMoving).toEqual({ from: false, to: false });

    act(() => {
      result.current.context.setIsMoving({ from: false, to: true });
    });

    expect(result.current.context.isMoving).toEqual({ from: false, to: true });

    act(() => {
      result.current.context.stopMove();
    });

    expect(result.current.context.isMoving).toEqual({ from: false, to: false });

    expect(result.current.context.value).toEqual(initialValue);
  });

  it('move sets clientX', () => {
    const initialValue = {
      from: 2,
      to: 4
    };

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { result } = renderHook(() =>
      useRange({ initialValue, name, options, step: 1, stepExtra: 10 })
    );

    expect(result.current.context.clientX).toBe(0);

    act(() => {
      result.current.context.move({ clientX: 100 } as unknown as MouseEvent);
    });

    expect(result.current.context.clientX).toBe(100);
  });

  it('Clicking on track changes the value', () => {
    const initialValue = {
      from: 2,
      to: 4
    };

    // https://github.com/jsdom/jsdom/issues/135
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetWidth: {
        get: function () {
          return 100;
        }
      }
    });

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { getByDataTest } = testRender(
      <TestComponent initialValue={initialValue} name={name} options={options} />
    );

    let state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: initialValue
    });

    fireEvent.click(getByDataTest('track'), { clientX: 90 });

    state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: { ...initialValue, to: 5 }
    });

    fireEvent.click(getByDataTest('track'), { clientX: 9 });

    state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: { from: 1, to: 5 }
    });
  });

  it('Clicking on track changes the value in single mode', () => {
    const initialValue = {
      from: 1,
      to: 3
    };

    // https://github.com/jsdom/jsdom/issues/135
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetWidth: {
        get: function () {
          return 100;
        }
      }
    });

    const name = 'price';

    const options = [1, 2, 3, 4, 5];

    const { getByDataTest } = testRender(
      <TestComponent initialValue={initialValue} name={name} options={options} single />
    );

    let state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: initialValue
    });

    fireEvent.click(getByDataTest('track'), { clientX: 90 });

    state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: { ...initialValue, to: 5 }
    });

    fireEvent.click(getByDataTest('track'), { clientX: 39 });

    state = JSON.parse(getByDataTest('track').textContent || '');

    expect(state).toEqual({
      clientX: 0,
      pixelsPerUnit: 25,
      unitsPerPixel: 0.04,
      value: { from: 1, to: 3 }
    });
  });
});
