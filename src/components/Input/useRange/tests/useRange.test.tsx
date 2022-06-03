import { renderHook } from '@testing-library/react-hooks';

import { useRange } from '../useRange';

describe('useRange', () => {
  it('TODO', () => {
    const initialValue = {
      from: 0,
      to: 10
    };
    const name = 'price';

    const { result } = renderHook(() =>
      useRange({ initialValue, max: 5, min: 1, name, step: 1, stepExtra: 10 })
    );
  });
});
