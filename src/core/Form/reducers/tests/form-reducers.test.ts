import { initialFormContext } from '@core/Form/context';

import {
  formRemoveFromArrayActionReducer,
  formRemoveFromObjectActionReducer,
  formSetActionReducer,
  formSetStateActionReducer
} from '..';

describe('Form reducers', () => {
  it('formRemoveFromArrayActionReducer with existing key', () => {
    const context = {
      ...initialFormContext,
      state: {
        0: { valid: true, value: { firstName: 'Ivan' } },
        1: { valid: true, value: { firstName: 'Maria' } }
      }
    };

    const result = formRemoveFromArrayActionReducer(context, {
      payload: { key: '0' },
      type: 'REMOVE_FROM_FORM'
    });

    expect(result).toEqual({
      ...initialFormContext,
      state: { 0: { valid: true, value: { firstName: 'Maria' } } }
    });
  });

  // eslint-disable-next-line max-len
  it('formRemoveFromArrayActionReducer when removing several elements from the back of the list', () => {
    const context = {
      ...initialFormContext,
      state: {
        0: { valid: true, value: { firstName: 'Ivan' } },
        1: { valid: true, value: { firstName: 'Maria' } },
        2: { valid: true, value: { firstName: 'Peter' } }
      }
    };

    const result = formRemoveFromArrayActionReducer(context, {
      payload: { key: '1' },
      type: 'REMOVE_FROM_FORM'
    });

    // Here we shouldn't have index 2 anymore:
    const result2 = formRemoveFromArrayActionReducer(result, {
      payload: { key: '2' },
      type: 'REMOVE_FROM_FORM'
    });

    expect(result2).toEqual({
      ...initialFormContext,
      state: { 0: { valid: true, value: { firstName: 'Ivan' } } }
    });
  });

  it('formRemoveFromObjectActionReducer with existing key', () => {
    const context = { ...initialFormContext, state: { firstName: { valid: true, value: 'Ivan' } } };

    const result = formRemoveFromObjectActionReducer(context, {
      payload: { key: 'firstName' },
      type: 'REMOVE_FROM_FORM'
    });

    expect(result).toEqual({
      ...initialFormContext,
      state: {}
    });
  });

  it('formRemoveFromObjectActionReducer with non existing key', () => {
    const context = { ...initialFormContext, state: { firstName: { valid: true, value: 'Ivan' } } };

    const result = formRemoveFromObjectActionReducer(context, {
      payload: { key: 'lastName' },
      type: 'REMOVE_FROM_FORM'
    });

    expect(result).toEqual(context);
  });

  it("formSetActionReducer when the key doesn't exist", () => {
    const payload = { key: 'firstName', valid: true, value: 'Ivan' };

    const result = formSetActionReducer(initialFormContext, {
      payload,
      type: 'SET_IN_FORM'
    });

    expect(result).toEqual({
      ...initialFormContext,
      state: { ...initialFormContext.state, firstName: { valid: true, value: 'Ivan' } }
    });
  });

  it('formSetActionReducer when the key exists and the valid and value are the same', () => {
    const context = { ...initialFormContext, state: { firstName: { valid: true, value: 'Ivan' } } };

    const payload = { key: 'firstName', valid: true, value: 'Ivan' };

    const result = formSetActionReducer(context, {
      payload,
      type: 'SET_IN_FORM'
    });

    expect(result).toBe(context);
  });

  it('formSetActionReducer when the key exists and only valid is the same', () => {
    const context = { ...initialFormContext, state: { firstName: { valid: true, value: 'Ivan' } } };

    const payload = { key: 'firstName', valid: true, value: 'Maria' };

    const result = formSetActionReducer(context, {
      payload,
      type: 'SET_IN_FORM'
    });

    expect(result).not.toBe(context);

    expect(result).toEqual({
      ...initialFormContext,
      state: { ...initialFormContext.state, firstName: { valid: true, value: 'Maria' } }
    });
  });

  it('formSetActionReducer when the key exists and only value is the same', () => {
    const context = { ...initialFormContext, state: { firstName: { valid: true, value: 'Ivan' } } };

    const payload = { key: 'firstName', valid: false, value: 'Ivan' };

    const result = formSetActionReducer(context, {
      payload,
      type: 'SET_IN_FORM'
    });

    expect(result).not.toBe(context);

    expect(result).toEqual({
      ...initialFormContext,
      state: { ...initialFormContext.state, firstName: { valid: false, value: 'Ivan' } }
    });
  });

  it('formSetStateActionReducer when the key exists and only value is the same', () => {
    const payload = {
      firstName: { valid: true, value: 'Ivan' },
      lastName: { valid: true, value: 'Ivanov' }
    };

    const result = formSetStateActionReducer(initialFormContext, {
      payload,
      type: 'SET_FORM_STATE'
    });

    expect(result).not.toBe(initialFormContext);

    expect(result).toEqual({
      ...initialFormContext,
      state: payload
    });
  });
});
