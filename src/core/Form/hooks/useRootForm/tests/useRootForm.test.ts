import { act, renderHook } from '@testing-library/react-hooks';

import { INITIAL_RESET_RECORD_KEY, ROOT_RESET_RECORD_KEY } from '@core/Form/constants';
import { FormStateEntryValue } from '@core/Form/types';

import { useRootForm } from '../useRootForm';

describe('useRootForm', () => {
  it('Has the right initial state', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };

    const { result } = renderHook(() => useRootForm({ formData }));

    expect(result.current.fieldToBeSet).toEqual({ id: '', value: undefined });

    expect(result.current.errors).toEqual({});

    expect(result.current.pristine).toBe(true);

    expect(result.current.focusedField).toBe('');

    expect(result.current.scrolledField).toBe('');

    expect(result.current.forceValidateFlag).toEqual({});

    expect(result.current.resetFlag).toEqual({ resetKey: INITIAL_RESET_RECORD_KEY });

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData
    });

    expect(result.current.isEdit).toBe(false);

    expect(result.current.getFieldId()).toBe('');
  });

  it('Updates initial reset record only while pristine', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };
    const formData2: FormStateEntryValue = { firstName: 'Ivan', lastName: '' };
    const formData3: FormStateEntryValue = { firstName: 'Ivan', lastName: 'I' };

    const { rerender, result } = renderHook(({ data }) => useRootForm({ formData: data }), {
      initialProps: { data: formData }
    });

    expect(result.current.pristine).toBe(true);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData
    });

    rerender({ data: formData2 });

    expect(result.current.pristine).toBe(true);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData2
    });

    act(() => {
      result.current.setDirty();
    });

    expect(result.current.pristine).toBe(false);

    rerender({ data: formData3 });

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData2
    });

    expect(result.current.pristine).toBe(false);
  });

  it('Toggles edit mode and sets the right resetRecords on cancel', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };

    jest.useFakeTimers();

    const { result } = renderHook(() => useRootForm({ formData }));

    expect(result.current.isEdit).toBe(false);

    act(() => {
      result.current.edit();
    });

    expect(result.current.isEdit).toBe(true);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData,
      [ROOT_RESET_RECORD_KEY]: formData
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isEdit).toBe(false);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData
    });
  });

  it('Toggles edit mode and sets the right resetRecords on save', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };

    jest.useFakeTimers();

    const { result } = renderHook(() => useRootForm({ formData }));

    expect(result.current.isEdit).toBe(false);

    act(() => {
      result.current.edit();
    });

    expect(result.current.isEdit).toBe(true);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData,
      [ROOT_RESET_RECORD_KEY]: formData
    });

    act(() => {
      result.current.save();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isEdit).toBe(false);

    expect(result.current.resetRecords).toEqual({
      [INITIAL_RESET_RECORD_KEY]: formData
    });
  });

  it('On reset sets the initial reset key and pristine to true', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };
    const newResetKey = 'someKey';

    jest.useFakeTimers();

    const { result } = renderHook(() => useRootForm({ formData }));

    act(() => {
      result.current.setResetFlag({ resetKey: newResetKey });
    });

    expect(result.current.resetFlag).toEqual({ resetKey: newResetKey });

    act(() => {
      result.current.setDirty();
    });

    expect(result.current.pristine).toBe(false);

    act(() => {
      result.current.reset();
    });

    expect(result.current.resetFlag).toEqual({ resetKey: INITIAL_RESET_RECORD_KEY });
    expect(result.current.pristine).toBe(true);
  });

  it('Calling forceValidate updates the forceValidateFlag', () => {
    const formData: FormStateEntryValue = { firstName: 'Ivan' };

    const { result } = renderHook(() => useRootForm({ formData }));

    const forceValidateFlagA = result.current.forceValidateFlag;

    act(() => {
      result.current.forceValidate();
    });

    expect(result.current.forceValidateFlag).not.toBe(forceValidateFlagA);
  });

  it('Registers and cleans field errors', () => {
    const fieldId = 'firstName';
    const formData: FormStateEntryValue = { firstName: 'Ivan' };
    const error = 'There is an error';

    const { result } = renderHook(() => useRootForm({ formData }));

    expect(result.current.errors).toEqual({});

    act(() => {
      result.current.registerFieldErrors({
        fieldId,
        fieldErrors: [
          {
            text: error
          }
        ]
      });
    });

    expect(result.current.errors).toEqual({ [fieldId]: [{ text: error }] });

    act(() => {
      result.current.registerFieldErrors({
        fieldId,
        fieldErrors: []
      });
    });

    expect(result.current.errors).toEqual({});
  });
});
