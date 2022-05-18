import { act, renderHook } from '@testing-library/react-hooks';

import { useMount } from '@rounik/react-custom-hooks';

import { FormRoot } from '@components';
import { useFormRoot } from '@components/Form/providers';
import { keyEvent } from '@services/utils';

import { useAutocomplete } from '../useAutocomplete';
import { FC } from 'react';

interface Fruit {
  ID: string;
  title: string;
}

const list: Fruit[] = [
  {
    ID: '1',
    title: 'Orange'
  },
  {
    ID: '2',
    title: 'Apple'
  }
];

const extractId = (item: Fruit) => item.ID;
const extractLabel = (item: Fruit) => item.title;

describe('useAutocomplete', () => {
  it('Returns the right properties', () => {
    const name = 'fruits';

    const { result } = renderHook(() => useAutocomplete({ extractId, extractLabel, list, name }));

    expect(typeof result.current.close).toBe('function');

    expect(result.current.errors).toEqual([]);

    expect(result.current.filteredList).toEqual(list);

    expect(result.current.focused).toBe(false);

    expect(result.current.focusedId).toBe('');

    expect(result.current.isEdit).toBe(false);

    expect(typeof result.current.onBlurHandler).toBe('function');

    expect(typeof result.current.onFocusHandler).toBe('function');

    expect(typeof result.current.open).toBe('function');

    expect(result.current.search).toBe('');

    expect(typeof result.current.select).toBe('function');

    expect(result.current.selected).toEqual([]);

    expect(typeof result.current.setSearch).toBe('function');

    expect(result.current.show).toBe(false);

    expect(result.current.touched).toBe(false);

    expect(result.current.valid).toBe(true);

    expect(result.current.validating).toBe(false);
  });

  it('Uses the initialValue with no multi and single option as initial value', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: [list[0]], list, name })
    );

    expect(result.current.selected).toEqual([list[0].ID]);
  });

  it('Uses the initialValue with no multi and several options as initial value', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: list, list, name })
    );

    expect(result.current.selected).toEqual([list[0].ID]);
  });

  it('Uses the initialValue with multi', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: list, list, multi: true, name })
    );

    expect(result.current.selected).toEqual(list.map((item) => item.ID));
  });

  it('Calling open sets show to true, close sets it to false', () => {
    const name = 'fruits';

    const { result } = renderHook(() => useAutocomplete({ extractId, extractLabel, list, name }));

    act(() => {
      result.current.open();
    });

    expect(result.current.show).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.show).toBe(false);
  });

  it('Setting search value filters data', () => {
    const name = 'fruits';

    const { result } = renderHook(() => useAutocomplete({ extractId, extractLabel, list, name }));

    act(() => {
      result.current.setSearch(list[0].title);
    });

    expect(result.current.search).toBe(list[0].title);

    expect(result.current.filteredList).toEqual([list[0]]);

    act(() => {
      result.current.setSearch('');
    });

    expect(result.current.search).toBe('');

    expect(result.current.filteredList).toEqual(list);
  });

  it("Doesn't update focused on keyup event if closed", () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: list, list, multi: true, name })
    );

    const event = new KeyboardEvent('keyup', { code: 'ArrowDown' });
    document.dispatchEvent(event);

    expect(result.current.focusedId).toBe('');
  });

  it('Updates focused on keyup event if opened', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: list, list, multi: true, name })
    );

    act(() => {
      result.current.open();
    });

    act(() => {
      keyEvent('keyup', 'ArrowDown');
    });

    expect(result.current.focusedId).toBe(list[0].ID);

    act(() => {
      keyEvent('keyup', 'ArrowDown');
    });

    expect(result.current.focusedId).toBe(list[1].ID);

    act(() => {
      keyEvent('keyup', 'ArrowDown');
    });

    expect(result.current.focusedId).toBe(list[0].ID);

    act(() => {
      keyEvent('keyup', 'ArrowUp');
    });

    expect(result.current.focusedId).toBe(list[1].ID);

    act(() => {
      keyEvent('keyup', 'ArrowUp');
    });

    expect(result.current.focusedId).toBe(list[0].ID);

    act(() => {
      keyEvent('keyup', 'End');
    });

    expect(result.current.focusedId).toBe(list[1].ID);

    act(() => {
      keyEvent('keyup', 'Home');
    });

    expect(result.current.focusedId).toBe(list[0].ID);

    // TODO: fix Escape keyup logic
    // act(() => {
    //   keyEvent('keyup', 'Escape');
    // });

    // expect(result.current.focusedId).toBe('');

    // expect(result.current.search).toBe('');

    // expect(result.current.selected).toEqual([]);

    // expect(result.current.show).toBe(false);
  });

  it('Calling select updates the selected list when multi', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: [], list, multi: true, name })
    );

    act(() => {
      result.current.select(list[0].ID);
    });

    expect(result.current.selected).toEqual([list[0].ID]);

    act(() => {
      result.current.select(list[1].ID);
    });

    expect(result.current.selected).toEqual(list.map((item) => item.ID));

    act(() => {
      result.current.select(list[0].ID);
    });

    expect(result.current.selected).toEqual([list[1].ID]);
  });

  it('Calling select updates the selected list when no multi', () => {
    const name = 'fruits';

    const { result } = renderHook(() =>
      useAutocomplete({ extractId, extractLabel, initialValue: [], list, multi: false, name })
    );

    act(() => {
      result.current.select(list[0].ID);
    });

    expect(result.current.selected).toEqual([list[0].ID]);

    act(() => {
      result.current.select(list[1].ID);
    });

    expect(result.current.selected).toEqual([list[1].ID]);

    act(() => {
      result.current.select(list[0].ID);
    });

    expect(result.current.selected).toEqual([list[0].ID]);
  });

  it('Setting value from root form', () => {
    const name = 'fruits';

    const ValueSetter = () => {
      const {
        methods: { setFieldValue }
      } = useFormRoot();

      useMount(() => {
        setTimeout(() => {
          setFieldValue({ id: name, value: [list[1]] });
        });
      });

      return null;
    };

    const Wrapper: FC = ({ children }) => {
      return (
        <FormRoot dataTest="root">
          <ValueSetter />
          {children}
        </FormRoot>
      );
    };

    jest.useFakeTimers();

    const { result } = renderHook(
      () =>
        useAutocomplete({ extractId, extractLabel, initialValue: [], list, multi: false, name }),
      {
        wrapper: Wrapper
      }
    );

    act(() => {
      result.current.select(list[0].ID);
    });

    expect(result.current.selected).toEqual([list[0].ID]);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.selected).toEqual([list[1].ID]);
  });
});
